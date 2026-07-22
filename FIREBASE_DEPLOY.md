# Deploy only the Go backend

The marketing frontend remains on `https://thepeakgarden.vn`. Deploy only the Go
container to Cloud Run, then configure the existing frontend host to proxy
`/api/**` to Cloud Run. Firestore is the database. Browser requests remain on
the website origin configured by `ALLOWED_ORIGIN`.

The checked-in configuration uses `asia-southeast1` (Singapore) for Cloud Run.
Create Firestore in a nearby location before writing production data; a
Firestore database location cannot be changed later.

## 1. Create and configure the Firebase project

1. Create a project in the Firebase console and attach billing (Blaze is needed
   for the Cloud Run integration).
2. Open **Build > Firestore Database > Create database**.
3. Choose **Production mode** and the location carefully.
4. Install `gcloud` and the Firebase CLI, then authenticate:

```sh
gcloud auth login
firebase login
gcloud auth application-default login
```

Set your project ID for the commands below:

```sh
export TPG_PROJECT_ID="your-firebase-project-id"
gcloud config set project "$TPG_PROJECT_ID"
firebase use --add "$TPG_PROJECT_ID"
```

Enable the services used for source deployment:

```sh
gcloud services enable run.googleapis.com firestore.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com
```

## 2. Deploy Firestore rules

The Go server library is authorized through IAM and does not use Firestore
client rules. The included rules deny all browser/mobile SDK access to the
private authentication records:

```sh
firebase deploy --only firestore:rules
```

## 3. Deploy the Go backend to Cloud Run

Use the existing frontend origin exactly as shown, without a trailing slash.

```sh
gcloud run deploy thepeakgarden-api \
  --source . \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --set-env-vars "FIREBASE_PROJECT_ID=$TPG_PROJECT_ID,COOKIE_SECURE=true,ALLOWED_ORIGIN=https://thepeakgarden.vn" \
  --max-instances 10
```

Cloud Run supplies Application Default Credentials to the container, so never
upload a service-account JSON key. If the service reports `PermissionDenied`
when accessing Firestore, grant its runtime service account the
`roles/datastore.user` role in Google Cloud IAM, then redeploy.

Test the returned Cloud Run URL. `/api/auth/me` should return HTTP 401 with a
JSON `not authenticated` error when no cookie is present; that confirms the
service is running and can accept API requests.

## 4. Connect the existing frontend host

Do not run `firebase deploy --only hosting` from this repository; doing so would
publish the frontend files. Configure the Apache/Nginx host serving
`https://thepeakgarden.vn` to proxy `/api/` to the Cloud Run service URL while
preserving the request path. Create an account from the existing website and
verify these collections in the Firestore console:

- `users`
- `auth_email_index`
- `auth_sessions`

## Redeploy after code changes

Redeploy only the backend:

```sh
gcloud run deploy thepeakgarden-api --source . --region asia-southeast1
```

Expired session documents are rejected by the application. For automatic
storage cleanup, add a Firestore TTL policy on the `auth_sessions.expires_at`
field in Google Cloud Console; TTL deletion is asynchronous and is not part of
authentication correctness.
