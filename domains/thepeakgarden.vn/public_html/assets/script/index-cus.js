$(function () {
    if (localStorage.getItem("template") === null) {
        localStorage.setItem('template', 'vi');
    }
    const url = window.location.href;
    $('.lang__vi').on('click', function () {
        //window.location = url;
        location.reload();
        localStorage.setItem('template', 'vi');
    })
    $('.lang__en').on('click', function () {
        //window.location = url;
        location.reload();
        localStorage.setItem('template', 'en');
    });
    const menuleft = $('.menu-left-pc');
    const menuright = $('.menu-right-pc');
    const app = {
        menuvileft: [{
            menu: 'Giới thiệu',
            link: '#block-introduce'
        }, {
            menu: 'Vị trí',
            link: '#block-location'
        }, {
            menu: 'Tiện ích',
            link: '#block-utili'
        }, {
            menu: 'Mặt bằng',
            link: '#block-plane'
        }],
        menuviright: [{
            menu: 'Căn hộ',
            link: '#block-video'
        }, {
            menu: 'Cơ hội đầu tư',
            link: '#block-investment'
        }, {
            menu: 'Tin tức',
            link: '#block-news'
        }, {
            menu: 'Liên hệ',
            link: '#footer'
        }],
        titlemain: [{
            img: './assets/images/title-news/title-0-vi.png'
        }],
        introduce: [{
            img: './assets/images/title-news/title-1-vi.png',
            desc: 'The Peak Garden không đơn thuần của một căn hộ để ở, đây được xem như tuyệt tác độc bản là nơi khởi nguồn đặc quyền về một cuộc sống: Thanh lọc cơ thể - Bảo vệ sức khoẻ - Khơi nguồn năng lượng thể chất lẫn tinh thần'
        }],
        ecological: [{
            titleimg: './assets/images/banner/titi-sinhthai.png'
        }],
        ecologicalcontent: [{
            image: './assets/images/banner/group1.jpg',
            link: '/',
            title: 'Bên trong từng căn hộ chăm sóc sức khoẻ Wellness Apartment tại dự án được trang bị hệ thống máy lọc không khí, Đèn bàn khử trùng UV-C, sơn kháng khuẩn,…giúp thanh lọc và bảo vệ hoàn hảo sức khoẻ gia chủ.',
            number: './assets/images/banner/1.png'
        }, {
            image: './assets/images/banner/group2.jpg',
            link: '/',
            title: 'Mỗi căn hộ đều được tối ưu hoá mặt thoáng với nhiều cửa sổ mở rộng tầm view thoáng đãng giúp đón ánh sáng và không khí trong lành vào ngôi nhà của bạn.',
            number: './assets/images/banner/2.png'
        }, {
            image: './assets/images/banner/group3.jpg',
            link: '/',
            title: 'Cư dân dự án được thoả sức hoà mình trong hệ thống mảng xanh nội khu theo phương đứng đẳng cấp, giúp điều hoà nhiệt độ toàn khu với Công viên Luna park hơn 6.000m2, hồ Thiên Đường lãng mạn hơn 3.000m2 và hệ thống vườn treo thác nước len lỏi trong mỗi toà nhà. ',
            number: './assets/images/banner/3.png'
        }, {
            image: './assets/images/banner/group4.jpg',
            link: '/',
            title: 'Với góc nhìn từ các căn hộ trên cao, cư dân được chiêm ngưỡng vẻ đẹp bình yên và thư thái của cỏ cây sông nước bao bọc xung quanh bởi KĐT Phú Mỹ Hưng được quy hoạch tiêu chuẩn và bài bản bậc nhất.',
            number: './assets/images/banner/4.png'
        }],
        locationOne: [{
            imglocation: './assets/images/banner/vi-tri.png',
            titletext: 'Kết nối thông suốt',
            content1: 'The Peak Garden là dự án sở hữu vị trí vàng hiếm hoi còn lại tọa lạc tại cung đường Nguyễn Lương Bằng - Tuyến phố tài chính “Tỷ đô” đắt giá bậc nhất của toàn khu Nam Sài Gòn, liền kề KĐT hiện đại Phú Mỹ Hưng và thuận tiện kết nối với khu vực trung tâm sầm uất.',
            content2: 'Tại The Peak Garden vừa đủ gần để 1 bước chân xuống phố, vừa đủ cách biệt để cư dân tận hưởng sự yên bình đặc quyền.',
            map: './assets/images/banner/map.png'
        }],
        locationTwo: [{
            imglocation2: './assets/images/banner/tien-ich.png',
            title: 'Đặc quyền giá trị'
        }],
        video: [{
            imgvideo: './assets/images/banner/thiet-ke.png',
            title: 'Trọn vẹn từng khoảnh khắc',
            subtitle: 'Những đường nét thiết kế nhằm mang đến một sự thỏa mãn không chỉ về thị giác mà ở đó mọi giác quan đều được đánh thức ở mức tối đa, tạo nên một bản nhạc tuyệt vời cho gia đình bạn.'
        }],
        timeline1: [{
            time: '0 - 5 phút',
            content1: 'Đại lộ Nguyễn Văn Linh',
            content2: 'BV Pháp Việt',
            content3: 'BV Tâm Đức',
            content4: 'UBND Quận 7',
            content5: 'TTTM Crescent mall',
            content6: 'Tuyến Metro số 4',
            content7: 'Trung tâm SECC',
            content8: 'Bưu điện Quận 7'
        }],
        timeline2: [{
            time: '5 - 10 phút',
            content1: 'ĐH RMIT',
            content2: 'ĐH Tôn Đức Thắng',
            content3: 'Cầu Phú Mỹ',
            content4: 'TTTM Lotte Mart',
            content5: 'TTTM SC VIVO'
        }],
        timeline3: [{
            time: '10 - 20 phút',
            content1: 'Chợ Bến Thành',
            content2: 'TTTM Bitexco',
            content3: 'Cao tốc Long Thành – Dầu Giây',
            content4: 'Cao tốc Bến Lức - Long Thành'
        }],
        tienich: [{
                image: './assets/images/utilities/05 - HỒ TẮM KHOÁNG NÓNG ONSEN.jpg',
                title: 'HỒ TẮM KHOÁNG NÓNG ONSEN'
            },
            {
                image: './assets/images/utilities/01 - HỒ BƠI SKY VIEW.JPG',
                title: 'HỒ BƠI SKY VIEW'
            },
            {
                image: './assets/images/utilities/02 - CÔNG VIÊN LUNA PARK HƠN 6000 M2 .jpg',
                title: 'CÔNG VIÊN LUNA PARK HƠN 6000M2'
            },
            {
                image: './assets/images/utilities/03 - HỒ THIÊN ĐƯỜNG HƠN 3000 M2 .JPG',
                title: 'HỒ THIÊN ĐƯỜNG HƠN 3000 M2'
            },
            {
                image: './assets/images/utilities/04 - TỔ HỢP VƯỜN TREO THÁC NƯỚC TRONG NHÀ.JPG',
                title: 'TỔ HỢP VƯỜN TREO THÁC NƯỚC TRONG NHÀ'
            },
            {
                image: './assets/images/utilities/06 - SPA _ SAUNA.JPG',
                title: 'SPA & SAUNA'
            },
            {
                image: './assets/images/utilities/07 - DETOX _ ORGANIC SHOP.JPG',
                title: 'DETOX & ORGANIC SHOP'
            },
            {
                image: './assets/images/utilities/08 - ĐÈN BÀN KHỦ TRÙNG UV-C.JPG',
                title: 'ĐÈN BÀN KHỬ TRÙNG UV'
            },
            {
                image: './assets/images/utilities/09 - SMARTHOME.JPG',
                title: 'SMARTHOME'
            },
            {
                image: './assets/images/utilities/10 - AN NINH 6 LỚP.JPG',
                title: 'AN NINH 7 LỚP'
            },
            {
                image: './assets/images/utilities/11 - BBQ GARDEN.JPG',
                title: 'BBQ GARDEN'
            },
            {
                image: './assets/images/utilities/12 - CHÒI NGHỈ.JPG',
                title: 'CHÒI NGHỈ'
            },
            {
                image: './assets/images/utilities/13 - ĐƯỜNG CẦU VỒNG.JPG',
                title: 'ĐƯỜNG CẦU VỒNG'
            },
            {
                image: './assets/images/utilities/14 - ĐƯỜNG DẠO BỘ TRÊN MÂY.JPG',
                title: 'ĐƯỜNG DẠO BỘ TRÊN MÂY'
            },
            {
                image: './assets/images/utilities/15 - VƯỜN ÁNH SÁNG.JPG',
                title: 'VƯỜN ÁNH SÁNG'
            },
            {
                image: './assets/images/utilities/16 - HỒ THƯ GIÃN JACUZZI.JPG',
                title: 'HỒ THƯ GIÃN JACUZZI'
            },
            {
                image: './assets/images/utilities/17 - KHU THỂ THAO NGOÀI TRỜI.JPG',
                title: 'KHU THỂ THAO NGOÀI TRỜI'
            },
            {
                image: './assets/images/utilities/18 - HỒ BƠI TRẺ EM.JPG',
                title: 'HỒ BƠI TRẺ EM'
            },
            {
                image: './assets/images/utilities/19 - LỐI DẠO BỘ.JPG',
                title: 'LỐI DẠO BỘ'
            }
        ],


        titlempp: [{
            title: 'Mặt bằng'
        }],
        titletab: [{
            tabtong: 'Mặt bằng tổng thê',
            tab0: 'Tầng 1',
            tab1: 'Tầng 2',
            tab2: 'Tầng 3',
            tab3: 'Tầng 4',
            tab50: 'Tầng 5',
            tab4: 'Tầng 6-24',
            tab5: 'Tầng 25',
            tab6: 'Tầng 26',
            tab7: 'Mặt Bằng Tiện Ích'
        }],
        investment: [{
            tab0: 'Vị thế vàng',
            img0: './assets/images/investment/icon-1.png',
            tab1: 'dịch vụ all-in-one',
            img1: './assets/images/investment/icon-2.png',
            tab2: 'Giá trị BĐS gia tăng theo thời gian',
            img2: './assets/images/investment/icon-3.png',
            tab3: 'Sức bật hạ tầng',
            img3: './assets/images/investment/icon-4.png',
            tab4: 'Cam kết vàng từ CĐT',
            img4: './assets/images/investment/icon-4.png',
        }],
        investmentcontent0: [{
            content: 'Dự án sở hữu vị trí vàng hiếm hoi còn lại toạ lạc tại cung đường Nguyễn Lương Bằng - Tuyến phố tài chính sầm uất của toàn khu Nam Sài Gòn. Một trong những tuyến đường có giá trị gia tăng “chóng mặt” không khác gì những khu trung tâm TP (tăng ít nhất 83% trong 2 năm qua) cùng tỉ suất cho thuê ổn định',
        }],
        investmentcontent1: [{
            content: 'Ngoài tiện ích nội khu, trong bán kính 150m-800m là hệ sinh thái dịch vụ đáp ứng mọi nhu cầu của cư dân: hệ thống Ngân hàng, siêu thị và các cửa hàng F&B nối tiếp nhau. Dọc theo 3km của tuyến đường là hàng loạt các hạ tầng xã hội hoàn thiện: Bệnh viện (Tâm Đức, FV, Gia Khang), trung tâm tiêm chủng VNVC… Chuỗi trường học đa quốc gia – đa cấp bậc, cùng các trung tâm đào tạo năng khiếu - TDTT.',
        }],
        investmentcontent2: [{
            content: 'Giữa thời điểm khan hiếm nguồn cung căn hộ nhưng nhu cầu sở hữu BĐS tại TP.HCM còn rất lớn. Với vị trí ấn tượng, The Peak Garden được xem như một kênh đầu tư cực hấp dẫn cho thị trường BĐS hạng sang tại khu trung tâm sầm uất Nam Sài Gòn, nhờ cơ hội gia tăng giá trị BĐS vượt trội theo thời gian',
        }],
        investmentcontent3: [{
            content: 'Hàng loạt công trình hạ tầng trọng điểm tại Nam Sài Gòn đang được đẩy mạnh triển khai tạo sức bật lớn trong tiềm năng gia tăng giá trị của The Peak Garden trong tương lai gần: Hệ thống hầm chui, cầu vượt tại ngã tư Nguyễn Văn Linh - Nguyễn Hữu Thọ, cầu Thủ Thiêm 3 tổng VĐT 3,100 tỷ đồng, cầu Thủ Thiêm 4 tổng VĐT 5,200 tỷ đồng, cùng hàng loạt các công trình hạ tầng giao thông trọng điểm khác',
        }],
        investmentcontent4: [{
            content: 'Cam kết mua lại sản phẩm với tỷ suất sinh lời hấp dẫn lên đến 14 %/năm. Đây được xem như một bảo chứng đắt giá về tiềm năng gia tăng giá trị cho The Peak Garden trong tương lai gần.',
        }],
        titleinvestment: [{
            title: 'CƠ HỘI ĐẦU TƯ',
        }],
        titleinews: [{
            title: 'Tin tức',
        }],
        notecopyright: [{
            content: 'Thông tin, hình ảnh các tiện ích trong website này chỉ mang tính chất tương đối và có thể được điều chỉnh theo quyết định của Chủ đầu tư tại từng thời điểm đảm bảo phù hợp quy hoạch và thực tế thi công của Dự án. Các thông tin, cam kết chính thức sẽ được quy định cụ thể tại Hợp đồng mua bán. Việc quản lý, vận hành và kinh doanh dự án sẽ theo quy định của Ban Quản Lý',
        }],
        form: [{
            title: 'ĐĂNG KÝ NHẬN THÔNG TIN DỰ ÁN',
            name: 'Họ tên:',
            email: 'Email',
            phone: 'Số điện thoại:',
            mess: 'Lời nhắn:',
            btn: 'Đăng ký'
        }],
        partnertitle: [{
            title: 'ĐỐI TÁC DỰ ÁN',
        }],
        menumobile: [{
            title: 'Giới thiệu',
            link: '#block-introduce'
        }, {
            title: 'Vị trí',
            link: '#block-location'
        }, {
            title: 'Tiện tích',
            link: '#block-utili'
        }, {
            title: 'Mặt bằng',
            link: '#block-plane'
        }, {
            title: 'Căn hộ',
            link: '#block-video'
        }, {
            title: 'Cơ hội đầu tư',
            link: '#block-investment'
        }, {
            title: 'Tin tức',
            link: '#block-news'
        }],
        renderMenuLeftVi: function () {
            const htmlmenu = this.menuvileft.map(menuitem => {
                return `<li><a href="${menuitem.link}">${menuitem.menu}</a></li>`
            })
            menuleft.html(htmlmenu.join(''));
        },
        renderMenuRightVi: function () {
            const htmls = this.menuviright.map(menuitem => {
                return `<li><a href="${menuitem.link}">${menuitem.menu}</a></li>`
            })
            menuright.html(htmls.join(''));
        },
        renderAllVi: function () {
            const htmlintro = this.introduce.map(intro => {
                return `<a class="item-link" href="/">
                            <img class="lazyload" width="630" height="100" data-src="${intro.img}" alt="banner">
                        </a>
                        <div class="banner_subtitle">
                            <p>${intro.desc}</p>
                        </div>`
            })
            //sinh thai
            const htmlsttt = this.ecological.map(sttt => {
                return `<a>
                            <img class="lazyload" width="582" height="140" data-src="${sttt.titleimg}" alt="icon title" />
                        </a>`
            })
            const htmlstcontent = this.ecologicalcontent.map(stct => {
                return `<div class="item_content col-xs-100">
                            <div class="item_content--banner">
                                <a>
                                    <img class="lazyload" width="488" height="255" data-src="${stct.image}" alt="banner">
                                </a>
                            </div>
                            <div class="item_content--text">
                                <div class="c-text-img">
                                    <a href="${stct.link}">
                                        <img class="lazyload" width="75" height="163" data-src="${stct.number}" alt="">
                                    </a>
                                </div>
                                <span>${stct.title}</span>
                            </div>
                        </div>`
            })

            //locationOne: locationOne
            const htmllocationOne = this.locationOne.map(location => {
                return `<div class="col-md-4 col-sm-12 col-xs-12">
                            <div class="grid_lct__content">
                                <div class="lct_title">
                                    <a>
                                        <img class="lazyload" width="398" height="89" data-src="${location.imglocation}" alt="icon title" />
                                    </a>
                                </div>
                                <div class="lct_item-content">
                                    <div class="lct_item_title">
                                        <h4>${location.titletext}</h4>
                                    </div>
                                    <div class="lct_item_text">
                                        <p>${location.content1}</p>
                                        <p>${location.content2}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-8 col-sm-12 col-xs-12">
                            <div class="wrapper-map">
                            <div class="dot-ani Phone is-animating"></div>
                                <img class="lazyload" width="827" height="590" data-src="${location.map}" alt="map">                                
                            </div>
                        </div>`
            })
            //locationTwo
            const htmllocationTwo = this.locationTwo.map(location2 => {
                return `<a>
                            <img class="lazyload" width="534" height="120" data-src="${location2.imglocation2}" alt="icon title" />
                        </a>
                        <h4>${location2.title}</h4>`
            })
            //video
            const htmlvideo = this.video.map(itemvid => {
                return `<a>
                            <img class="lazyload" width="501" height="120" data-src="${itemvid.imgvideo}" alt="icon title" />
                        </a>
                        <h4>${itemvid.title}</h4>`
            })
            const htmlsubvd = this.video.map(itemvid => {
                return `<p>${itemvid.subtitle}</p>`
            })
            //timeline
            const htmltimeline1 = this.timeline1.map(item => {
                return `<div class="timestamp">
                            <span class="date">${item.time}<span>
                        </div>
                        <div class="status">
                            <ul>
                                <li>${item.content1}</li>
                                <li>${item.content2}</li>
                                <li>${item.content3}</li>
                                <li>${item.content4}</li>
                                <li>${item.content5}</li>
                                <li>${item.content6}</li>
                                <li>${item.content7}</li>
                                <li>${item.content8}</li>
                            </ul>
                        </div>`
            });
            //timeline 2
            const htmltimeline2 = this.timeline2.map(item => {
                return `<div class="timestamp">
                            <span class="date">${item.time}<span>
                        </div>
                        <div class="status">
                            <ul>
                                <li>${item.content1}</li>
                                <li>${item.content2}</li>
                                <li>${item.content3}</li>
                                <li>${item.content4}</li>
                                <li>${item.content5}</li>
                            </ul>
                        </div>`
            });
            //timeline
            const htmltimeline3 = this.timeline3.map(item => {
                return `<div class="timestamp">
                            <span class="date">${item.time}<span>
                        </div>
                        <div class="status">
                            <ul>
                                <li>${item.content1}</li>
                                <li>${item.content2}</li>
                                <li>${item.content3}</li>
                                <li>${item.content4}</li>
                            </ul>
                        </div>`
            });
            //tien ich
            const htmltienich = this.tienich.map(item => {
                return `<div class="card">
                            <div>
                                <a class="sliderLink">
                                    <img src="${item.image}">
                                    <span>${item.title}</span>
                                </a>
                            </div>
                        </div>`
            });
            //titlempp
            const htmltitlempp = this.titlempp.map(item => {
                return `<h4>${item.title}</h4>`;
            })
            //titletab
            const htmltitletab = this.titletab.map(item => {
                return `
                <button class="htp-tablink active" data-id="htp-tab-8">${item.tab7}</button>
                <button class="htp-tablink" data-id="htp-tab-1">${item.tab0}</button>
                <button class="htp-tablink" data-id="htp-tab-2">${item.tab1}</button>
                <button class="htp-tablink" data-id="htp-tab-3">${item.tab2}</button>
                <button class="htp-tablink" data-id="htp-tab-4">${item.tab3}</button>
                <button class="htp-tablink" data-id="htp-tab-50">${item.tab50}</button>
                <button class="htp-tablink" data-id="htp-tab-5">${item.tab4}</button>
      
                <button class="htp-tablink" data-id="htp-tab-6">${item.tab5}</button>
                <button class="htp-tablink" data-id="htp-tab-7">${item.tab6}</button>`

            });
            //investment
            const htmlinves = this.investment.map(item => {
                return `<button class="htp-tablink-inv ic-0" data-id="htp-tab-inv-0">
                            <div class="icon-pos">
                                <span class="icon-iven "><img class="lazyload" data-src="${item.img0}" alt="icon"/></span>
                                <span class="title-iven">${item.tab0}</span>
                            </div>  
                        </button>
                        <button class="htp-tablink-inv ic-1" data-id="htp-tab-inv-1">
                            <div class="icon-pos">
                                <span class="icon-iven "><img class="lazyload" data-src="${item.img1}" alt="icon"/></span>
                                <span class="title-iven">${item.tab1}</span>
                            </div>  
                        </button>
                        <button class="htp-tablink-inv ic-2 active" data-id="htp-tab-inv-2">
                            <div class="icon-pos">
                                <span class="icon-iven "><img class="lazyload" data-src="${item.img2}" alt="icon"/></span>
                                <span class="title-iven">${item.tab2}</span>
                            </div>
                        </button>
                        <button class="htp-tablink-inv ic-3" " data-id="htp-tab-inv-3 ">
                            <div class="icon-pos ">
                            <span class="icon-iven "><img class="lazyload" data-src="${item.img3}" alt="icon "/></span>
                            <span class="title-iven ">${item.tab3}</span>
                        </div>
                        </button>
                        <button class="htp-tablink-inv ic-4 " data-id="htp-tab-inv-4 ">
                            <div class="icon-pos ">
                            <span class="icon-iven "><img class="lazyload" data-src="${item.img4}" alt="icon "/></span>
                            <span class="title-iven ">${item.tab4}</span>
                        </div>
                        </button>`
            });
            //investmentcontent0
            const htmltabin0 = this.investmentcontent0.map(item => {
                return `
                            <div class="item ">
                                <div class="item__content ">
                                    ${item.content}
                                </div>
                          
                        </div>`
            });
            //investmentcontent1
            const htmltabin1 = this.investmentcontent1.map(item => {
                return `
                            <div class="item ">
                                <div class="item__content ">
                                    ${item.content}
                                </div>
                
                        </div>`
            });
            //investmentcontent2
            const htmltabin2 = this.investmentcontent2.map(item => {
                return `
                            <div class="item ">
                                <div class="item__content ">
                                    ${item.content}
                                </div>
                            </div>
                       `
            });
            //investmentcontent3
            const htmltabin3 = this.investmentcontent3.map(item => {
                return `
                            <div class="item ">
                                <div class="item__content ">
                                    ${item.content}
                                </div>
                            </div>
                       `
            });
            //investmentcontent4
            const htmltabin4 = this.investmentcontent4.map(item => {
                return `
                            <div class="item ">
                                <div class="item__content ">
                                    ${item.content}
                                </div>
                           
                        </div>`
            });
            //titleinvestment
            const htmltitleinvestment = this.titleinvestment.map(item => {
                return `<h4>${item.title}</h4>`;
            });
            //titleinews
            const htmltitlenews = this.titleinews.map(item => {
                return `<h4>${item.title}</h4>`;
            });
            //notecopyright
            const htmlnoteconte = this.notecopyright.map(item => {
                return `<p>${item.content}</p>`;
            });
            //form
            const htmlfrtitle = this.form.map(item => {
                return `${item.title}`;
            });
            const htmlfrname = this.form.map(item => {
                return `${item.name}`;
            });
            const htmlfrphone = this.form.map(item => {
                return `${item.phone}`;
            });
            const htmlfremail = this.form.map(item => {
                return `${item.email}`;
            });
            const htmlfrnote = this.form.map(item => {
                return `${item.mess}`;
            });
            const htmlfrbtn = this.form.map(item => {
                return `${item.btn}`;
            });
            //partnertitle
            const htmltitlepart = this.partnertitle.map(item => {
                return `<h4>${item.title}</h4>`;
            });
            //menumobile
            const htmlmenumobile = this.menumobile.map(item => {
                return `<li class="menu-item menu-item-type-post_type menu-item-object-page ">
                            <a href="${item.link}">${item.title}</a>
                        </li>`;
            });
            //htmltitlemain
            const htmltitlemain = this.titlemain.map(item => {
                return `<a class="item-link" href="/">
                        <img class="lazyload" width="630" height="100" data-src="${item.img}" alt="banner">
                    </a>`;
            });

            //render
            $('.item-banner-content').html(htmlintro.join(''));
            $('.sth_title').html(htmlsttt.join(''));
            $('.sth_item-content').html(htmlstcontent.join(''));
            $('.wrapper-section-location').html(htmllocationOne.join(''));
            $('.ultili_title').html(htmllocationTwo.join(''));
            $('.video_title').html(htmlvideo.join(''));
            $('.grid_video__content .subtitle-content').html(htmlsubvd.join(''));
            $('.slide-timeline-1').html(htmltimeline1.join(''));
            $('.slide-timeline-2').html(htmltimeline2.join(''));
            $('.slide-timeline-3').html(htmltimeline3.join(''));
            $('#slider-slick-home').html(htmltienich.join(''));
            $('.htp-tablinks-el').html(htmltitletab.join(''));
            $('.grid_sth__content .place-title').html(htmltitlempp.join(''));
            $('.htp-tablinks-investment').html(htmlinves.join(''));
            $('.htp-tabcontents-investment .tab0.htp-tabcontent-inv .owl-carousel').html(htmltabin0.join('') + htmltabin1.join('') + htmltabin2.join('') + htmltabin3.join('') + htmltabin4.join(''));
            $('.homepage-banner-investment .item-banner .title').html(htmltitleinvestment.join(''));
            $('.new--head .new-title').html(htmltitlenews.join(''));
            $('.ft_description').html(htmlnoteconte.join(''));
            $('.pnewle-form h3.text-center').html(htmlfrtitle.join(''));
            $('.pnewle-form label.contactFormPhone').html(htmlfrphone.join(''));
            $('.pnewle-form label.contactFormName').html(htmlfrname.join(''));
            $('.pnewle-form label.contactFormEmail').html(htmlfremail.join(''));
            $('.pnewle-form label.contactFormBody').html(htmlfrnote.join(''));
            $('.pnewle-form button.btn-outline').html(htmlfrbtn.join(''));
            $('.brand-title').html(htmltitlepart.join(''));
            $('.nav-mobile-menu #menu-main-menu').html(htmlmenumobile.join(''));
            $('.title-banner-main').html(htmltitlemain.join(''));

        },
        start: function () {
            this.renderMenuLeftVi();
            this.renderMenuRightVi();
            this.renderAllVi();
        }
    }

    /*=========================== NỘI DUNG TIẾNG ANH ===================================== */
    const appen = {
        menuvileft: [{
            menu: 'About us',
            link: '#block-introduce'
        }, {
            menu: 'Location',
            link: '#block-location'
        }, {
            menu: 'Utilities',
            link: '#block-utili'
        }, {
            menu: 'Plane',
            link: '#block-plane'
        }],
        menuviright: [{
            menu: 'Apartment',
            link: '#block-video'
        }, {
            menu: 'Investment',
            link: '#block-investment'
        }, {
            menu: 'News',
            link: '#block-news'
        }, {
            menu: 'Contacts',
            link: '#footer'
        }],
        titlemain: [{
            img: './assets/images/title-news/title-0-en.png'
        }],
        introduce: [{
            img: './assets/images/title-news/title-1-en.png',
            desc: 'The Peak Garden is not just an apartment to live in, this is considered as a unique masterpiece and the originate of privileged: Purifying Body - Protecting Health - Unleashing Physical and Mental Energy '
        }],
        ecological: [{
            titleimg: './assets/images/title-en/2.png'
        }],
        ecologicalcontent: [{
            image: './assets/images/banner/group1.jpg',
            link: '/',
            title: 'Inside each Wellness Apartment is equipped with an air purifier system, UV-C sterilizing lamp, antibacterial paint, etc. to help purify and perfectly protect the health of the owner.',
            number: './assets/images/banner/1.png'
        }, {
            image: './assets/images/banner/group2.jpg',
            link: '/',
            title: 'Each apartment has many windows to widen the view for catching shining and fresh air into the house.',
            number: './assets/images/banner/2.png'
        }, {
            image: './assets/images/banner/group3.jpg',
            link: '/',
            title: 'Residents can freely immerse themselves in the high-class vertical internal green system, helping to regulate the temperature of the whole area with Luna park over 6,000m2, romantic paradise lake over 3,000m2, and hanging waterfall garden system in each building.',
            number: './assets/images/banner/3.png'
        }, {
            image: './assets/images/banner/group4.jpg',
            link: '/',
            title: 'With the view from the high floor apartments, residents can admire the peaceful sightseeings with trees and rivers surrounded by the most standard living urban - Phu My Hung area.',
            number: './assets/images/banner/4.png'
        }],
        locationOne: [{
            imglocation: './assets/images/title-en/3.png',
            //titletext: 'Kết nối thông suốt',
            content1: 'The Peak Garden is one of the rare golden projects located at Nguyen Luong Bang - the most expensive "Billion Dollar" financial street of South Saigon, adjacent to the modern urban area - Phu My Hung and connect to the busy downtown.',
            content2: "At The Peak Garden, it's close to being one step down the street and far enough away barely to enjoy the privileged peace.",
            map: './assets/images/banner/map.png'
        }],
        locationTwo: [{
            imglocation2: './assets/images/title-en/4.png',
            title: 'Đặc quyền giá trị'
        }],
        video: [{
            imgvideo: './assets/images/title-en/6.png',
            title: 'Living in the moment',
            subtitle: 'The design lines are intended to bring not only visual satisfaction but where all senses are fully awakened, creating a wonderful rhythm for your family.'
        }],
        timeline1: [{
            time: '0 - 5 Minute',
            content1: 'Nguyen Van Linh Avenue',
            content2: 'FV Hospital',
            content3: 'Tam Duc Hospital',
            content4: "People's Committee of District 7",
            content5: 'Crescent Mall Shopping Center',
            content6: 'Metro 4',
            content7: 'Saigon Exhibition and Convention Center / SECC',
            content8: 'Post Office District 7'
        }],
        timeline2: [{
            time: '5 - 10 Minute',
            content1: 'RMIT University',
            content2: 'Ton Duc Thang University',
            content3: 'Phu My Bridge',
            content4: 'Lotte Mart',
            content5: 'SC VivoCity mall'
        }],
        timeline3: [{
            time: '10 - 20 Minute',
            content1: 'Ben Thanh Market',
            content2: 'Bitexco Tower',
            content3: 'Long Thanh – Dau Giay Expressway',
            content4: 'Ben Luc - Long Thanh Expressway'
        }],
        tienich: [{
            image: './assets/images/utilities/05 - HỒ TẮM KHOÁNG NÓNG ONSEN.jpg',
            title: 'ONSEN HOT SPRING BATH'
        },
        {
            image: './assets/images/utilities/01 - HỒ BƠI SKY VIEW.JPG',
            title: 'SKY VIEW SWIMMING POOL'
        },
        {
            image: './assets/images/utilities/02 - CÔNG VIÊN LUNA PARK HƠN 6000 M2 .jpg',
            title: 'LUNA PARK OVER 6000 M2'
        },
        {
            image: './assets/images/utilities/03 - HỒ THIÊN ĐƯỜNG HƠN 3000 M2 .JPG',
            title: 'PARADISE LAKE OVER 3000 M2'
        },
        {
            image: './assets/images/utilities/04 - TỔ HỢP VƯỜN TREO THÁC NƯỚC TRONG NHÀ.JPG',
            title: 'THE COMPLEX OF HANGING GARDENS WITH WATERFALLS INSIDE'
        },
        {
            image: './assets/images/utilities/06 - SPA _ SAUNA.JPG',
            title: 'SPA & SAUNA'
        },
        {
            image: './assets/images/utilities/07 - DETOX _ ORGANIC SHOP.JPG',
            title: 'DETOX & ORGANIC SHOP'
        },
        {
            image: './assets/images/utilities/08 - ĐÈN BÀN KHỦ TRÙNG UV-C.jpg',
            title: 'UV-C STERILIZING LAMP'
        },
        {
            image: './assets/images/utilities/09 - SMARTHOME.JPG',
            title: 'SMARTHOME'
        },
        {
            image: './assets/images/utilities/10 - AN NINH 6 LỚP.JPG',
            title: '7 LAYERS SECURITY'
        },
        {
            image: './assets/images/utilities/11 - BBQ GARDEN.JPG',
            title: 'BBQ GARDEN'
        },
        {
            image: './assets/images/utilities/12 - CHÒI NGHỈ.JPG',
            title: 'PAVILIONS'
        },
        {
            image: './assets/images/utilities/13 - ĐƯỜNG CẦU VỒNG.JPG',
            title: 'RAINBOW ROAD'
        },
        {
            image: './assets/images/utilities/14 - ĐƯỜNG DẠO BỘ TRÊN MÂY.JPG',
            title: 'WALKING IN THE CLOUDS'
        },
        {
            image: './assets/images/utilities/15 - VƯỜN ÁNH SÁNG.JPG',
            title: 'GARDEN LIGHTS'
        },
        {
            image: './assets/images/utilities/16 - HỒ THƯ GIÃN JACUZZI.JPG',
            title: 'JACUZZI'
        },
        {
            image: './assets/images/utilities/17 - KHU THỂ THAO NGOÀI TRỜI.JPG',
            title: 'OUTDOOR SPORTS AREA'
        },
        {
            image: './assets/images/utilities/18 - HỒ BƠI TRẺ EM.JPG',
            title: 'CHILDREN SWIMMING POOL'
        },
        {
            image: './assets/images/utilities/19 - LỐI DẠO BỘ.JPG',
            title: 'PROMENADE.'
        }
 ],

        titlempp: [{
            title: 'Floor plan'
        }],

        titletab: [{
            tabtong: 'Master Plan',
            tab0: '1st Floor',
            tab1: '2nd Floor',
            tab2: '3nd Floor',
            tab3: '4rd Floor',
            tab50: '5rd Floor',
            tab4: '6-24th Floor',
            tab5: '25th Floor',
            tab6: '26th Floor',
            tab7: 'Utilities'
        }],
        investment: [{
            tab0: 'Golden Location',
            img0: './assets/images/investment/icon-1.png',
            tab1: 'All-in-one service:',
            img1: './assets/images/investment/icon-2.png',
            tab2: 'The value increases like wildfire',
            img2: './assets/images/investment/icon-3.png',
            tab3: 'A great infrastructure bounce',
            img3: './assets/images/investment/icon-4.png',
            tab4: 'The Gold commitment from the Investor',
            img4: './assets/images/investment/icon-4.png',
        }],
        investmentcontent0: [{
            content: 'Owning the rare remaining golden position, located at Nguyen Luong Bang road – the financial street of Nam Sai Gon area. This is one of the "vertical" value-added routes (increasing at least 83% in the past 2 years) with a stable rental rate',
        }],
        investmentcontent1: [{
            content: 'Besides internal utilities, there’s a service ecosystem within a radius of 150m-800m to meet all the needs of residents: a banking system, a supermarket, and F&B stores in succession. Along 3km of the route is a series of completed social infrastructures: Hospitals (Tam Duc, FV, Gia Khang), VNVC vaccination center… multi-national and multi-level school, and centers talent sports training.',
        }],
        investmentcontent2: [{
            content: 'Despite the scarcity of apartment supply, the demand for real estate ownership in Ho Chi Minh City is still very large. With an impressive location, The Peak Garden is an extremely attractive channel investment for the luxury real estate market in the Nam Sai Gon area with increasing outstanding value over time.',
        }],
        investmentcontent3: [{
            content: 'A series of key infrastructure projects at Nam Sai Gon has been being promoted, creating a great bounce for The Peak in the near future: Underpass system, the overpass at the intersection of Nguyen Van Linh - Nguyen Huu Tho road, Thu Thiem 3 bridge with a total investment of 3,100 billion VND, Thu Thiem 4 bridge with a total investment of 5,200 billion VND, and a series of other key transport infrastructure projects.',
        }],
        investmentcontent4: [{
            content: 'Commit to buy back products with attractive profit rates up to 14% | year. This is considered an expensive guarantee for the potential of The Peak Garden to increase its value in the future.',
        }],
        titleinvestment: [{
            title: 'INVESTMENT OPPORTUNITIES',
        }],
        titleinews: [{
            title: 'News',
        }],
        notecopyright: [{
            content: "Information and images of utilities in this website are photographic images and can be adjusted at the discretion of the Investor at a specific time to ensure compliance with the project's planning and actual construction. The official information and commitments will be specified in the Sales Contract. The management, operation, and business of the project will follow the regulations of the Project Management Board"
        }],
        form: [{
            title: 'GET PROJECT INFORMATION HERE',
            name: 'Name:',
            email: 'Email',
            phone: 'Phone:',
            mess: 'Notes:',
            btn: 'Register'
        }],
        partnertitle: [{
            title: 'Partner',
        }],
        menumobile: [{
            title: 'About us',
            link: '#block-introduce'
        }, {
            title: 'Location',
            link: '#block-location'
        }, {
            title: 'Utilities',
            link: '#block-utili'
        }, {
            title: 'Plane',
            link: '#block-plane'
        }, {
            title: 'Apartment',
            link: '#block-video'
        }, {
            title: 'Investment',
            link: '#block-investment'
        }, {
            title: 'News',
            link: '#block-news'
        }],
        renderMenuLeftEn: function () {
            const htmls = this.menuvileft.map(menuitem => {
                return `<li><a href="${menuitem.link}">${menuitem.menu}</a></li>`
            })
            menuleft.html(htmls.join(''));
        },
        renderMenuRightEn: function () {
            const htmls = this.menuviright.map(menuitem => {
                return `<li><a href="${menuitem.link}">${menuitem.menu}</a></li>`
            })
            menuright.html(htmls.join(''));
        },
        renderAllEn: function () {
            $('.investgrow').text('Invested And Developed By').css('text-transform', 'uppercase')
            $('.phanphoi').text('exclusive distributor').css('text-transform', 'uppercase');
            $('.formnote').text('Please kindly fulfill your information here to get more details and consultant as soon as possible.')
            const htmlintro = this.introduce.map(intro => {
                return `<a class="item-link" href="/">
                            <img class="lazyload" width="630" height="100" data-src="${intro.img}" alt="banner">
                        </a>
                        <div class="banner_subtitle">
                            <p>${intro.desc}</p>
                        </div>`
            })
            //sinh thai
            const htmlsttt = this.ecological.map(sttt => {
                return `<a>
                            <img class="lazyload" width="582" height="140" data-src="${sttt.titleimg}" alt="icon title" />
                        </a>`
            })
            const htmlstcontent = this.ecologicalcontent.map(stct => {
                return `<div class="item_content col-xs-100">
                            <div class="item_content--banner">
                                <a>
                                    <img class="lazyload" width="488" height="255" data-src="${stct.image}" alt="banner">
                                </a>
                            </div>
                            <div class="item_content--text">
                                <div class="c-text-img">
                                    <a href="${stct.link}">
                                        <img class="lazyload" width="75" height="163" data-src="${stct.number}" alt="">
                                    </a>
                                </div>
                                <span>${stct.title}</span>
                            </div>
                        </div>`
            })
            //locationOne: locationOne
            const htmllocationOne = this.locationOne.map(location => {
                return `<div class="col-md-4 col-sm-12 col-xs-12">
                            <div class="grid_lct__content">
                                <div class="lct_title">
                                    <a>
                                  
                                        <img class="lazyload" width="398" height="89" data-src="${location.imglocation}" alt="icon title" />
                                    </a>
                                </div>
                                <div class="lct_item-content">
                                    <div class="hide lct_item_title">
                                        <h4>${location.titletext}</h4>
                                    </div>
                                    <div class="lct_item_text">
                                        <p>${location.content1}</p>
                                        <p>${location.content2}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-8 col-sm-12 col-xs-12">
                            <div class="wrapper-map">
                            <div class="dot-ani Phone is-animating"></div>
                                <img class="lazyload" width="827" height="590" data-src="${location.map}" alt="map">                            
                            </div>
                        </div>`
            })

            //
            //locationTwo
            const htmllocationTwo = this.locationTwo.map(location2 => {
                return `<a>
                            <img class="lazyload" width="534" height="120" data-src="${location2.imglocation2}" alt="icon title" />
                        </a>
                        <h4 class="hide">${location2.title}</h4>`
            })
            //video
            const htmlvideo = this.video.map(itemvid => {
                return `<a>
                            <img class="lazyload" width="501" height="120" data-src="${itemvid.imgvideo}" alt="icon title" />
                        </a>
                        <h4 class="hide">${itemvid.title}</h4>`
            })
            const htmlsubvd = this.video.map(itemvid => {
                return `<p>${itemvid.subtitle}</p>`;
            })
            //timeline
            const htmltimeline1 = this.timeline1.map(item => {
                return `<div class="timestamp">
                            <span class="date">${item.time}<span>
                        </div>
                        <div class="status">
                            <ul>
                                <li>${item.content1}</li>
                                <li>${item.content2}</li>
                                <li>${item.content3}</li>
                                <li>${item.content4}</li>
                                <li>${item.content5}</li>
                                <li>${item.content6}</li>
                                <li>${item.content7}</li>
                                <li>${item.content8}</li>
                            </ul>
                        </div>`
            });
            //timeline 2
            const htmltimeline2 = this.timeline2.map(item => {
                return `<div class="timestamp">
                            <span class="date">${item.time}<span>
                        </div>
                        <div class="status">
                            <ul>
                                <li>${item.content1}</li>
                                <li>${item.content2}</li>
                                <li>${item.content3}</li>
                                <li>${item.content4}</li>
                                <li>${item.content5}</li>
                            </ul>
                        </div>`
            });
            //timeline
            const htmltimeline3 = this.timeline3.map(item => {
                return `<div class="timestamp">
                            <span class="date">${item.time}<span>
                        </div>
                        <div class="status">
                            <ul>
                                <li>${item.content1}</li>
                                <li>${item.content2}</li>
                                <li>${item.content3}</li>
                                <li>${item.content4}</li>
                            </ul>
                        </div>`
            });
            //tien ich
            const htmltienich = this.tienich.map(item => {
                return `<div class="card">
                            <div>
                                <a class="sliderLink">
                                    <img src="${item.image}">
                                    <span>${item.title}</span>
                                </a>
                            </div>
                        </div>`
            });
            //titlempp
            const htmltitlempp = this.titlempp.map(item => {
                return `<h4>${item.title}</h4>`;
            })
            //titletab
            const htmltitletab = this.titletab.map(item => {
                return `
                <button class="htp-tablink active" data-id="htp-tab-8">${item.tab7}</button>
                <button class="htp-tablink " data-id="htp-tab-1">${item.tab0}</button>
                <button class="htp-tablink" data-id="htp-tab-2">${item.tab1}</button>
                <button class="htp-tablink" data-id="htp-tab-3">${item.tab2}</button>
                <button class="htp-tablink" data-id="htp-tab-4">${item.tab3}</button>
                <button class="htp-tablink" data-id="htp-tab-50">${item.tab50}</button>
                <button class="htp-tablink" data-id="htp-tab-5">${item.tab4}</button>
                <button class="htp-tablink" data-id="htp-tab-6">${item.tab5}</button>
                <button class="htp-tablink" data-id="htp-tab-7">${item.tab6}</button>
                `
            });
            //investment
            const htmlinves = this.investment.map(item => {
                return `<button class="htp-tablink-inv ic-0" data-id="htp-tab-inv-0">
                            <div class="icon-pos">
                                <span class="icon-iven "><img class="lazyload" data-src="${item.img0}" alt="icon"/></span>
                                <span class="title-iven">${item.tab0}</span>
                            </div>  
                        </button>
                        <button class="htp-tablink-inv ic-1" data-id="htp-tab-inv-1">
                            <div class="icon-pos">
                                <span class="icon-iven "><img class="lazyload" data-src="${item.img1}" alt="icon"/></span>
                                <span class="title-iven">${item.tab1}</span>
                            </div>  
                        </button>
                        <button class="htp-tablink-inv ic-2 active" data-id="htp-tab-inv-2">
                            <div class="icon-pos">
                                <span class="icon-iven "><img class="lazyload" data-src="${item.img2}" alt="icon"/></span>
                                <span class="title-iven">${item.tab2}</span>
                            </div>
                        </button>
                        <button class="htp-tablink-inv ic-3" " data-id="htp-tab-inv-3 ">
                            <div class="icon-pos ">
                            <span class="icon-iven "><img class="lazyload" data-src="${item.img3}" alt="icon "/></span>
                            <span class="title-iven ">${item.tab3}</span>
                        </div>
                        </button>
                        <button class="htp-tablink-inv ic-4 " data-id="htp-tab-inv-4 ">
                            <div class="icon-pos ">
                            <span class="icon-iven "><img class="lazyload" data-src="${item.img4}" alt="icon "/></span>
                            <span class="title-iven ">${item.tab4}</span>
                        </div>
                        </button>`
            });
            //investmentcontent0
            const htmltabin0 = this.investmentcontent0.map(item => {
                return `
                            <div class="item ">
                                <div class="item__content ">
                                    ${item.content}
                                </div>
                            </div>
                    `
            });
            //investmentcontent1
            const htmltabin1 = this.investmentcontent1.map(item => {
                return `
                            <div class="item ">
                                <div class="item__content ">
                                    ${item.content}
                                </div>
                            </div>
                       `
            });
            //investmentcontent2
            const htmltabin2 = this.investmentcontent2.map(item => {
                return `
                            <div class="item ">
                                <div class="item__content ">
                                    ${item.content}
                                </div>
                            </div>
                   `
            });
            //investmentcontent3
            const htmltabin3 = this.investmentcontent3.map(item => {
                return `
                            <div class="item ">
                                <div class="item__content ">
                                    ${item.content}
                                </div>
                            </div>
                        `
            });
            //investmentcontent4
            const htmltabin4 = this.investmentcontent4.map(item => {
                return `
                            <div class="item ">
                                <div class="item__content ">
                                    ${item.content}
                                </div>
                            </div>
                     `
            });
            //titleinvestment
            const htmltitleinvestment = this.titleinvestment.map(item => {
                return `<h4>${item.title}</h4>`;
            });
            //titleinews
            const htmltitlenews = this.titleinews.map(item => {
                return `<h4>${item.title}</h4>`;
            });
            //notecopyright
            const htmlnoteconte = this.notecopyright.map(item => {
                return `<p>${item.content}</p>`;
            });
            //form
            const htmlfrtitle = this.form.map(item => {
                return `${item.title}`;
            });
            const htmlfrname = this.form.map(item => {
                return `${item.name}`;
            });
            const htmlfrphone = this.form.map(item => {
                return `${item.phone}`;
            });
            const htmlfremail = this.form.map(item => {
                return `${item.email}`;
            });
            const htmlfrnote = this.form.map(item => {
                return `${item.mess}`;
            });
            const htmlfrbtn = this.form.map(item => {
                return `${item.btn}`;
            });
            //partnertitle
            const htmltitlepart = this.partnertitle.map(item => {
                return `<h4>${item.title}</h4>`;
            });
            //menumobile
            const htmlmenumobile = this.menumobile.map(item => {
                return `<li class="menu-item menu-item-type-post_type menu-item-object-page ">
                            <a href="${item.link}">${item.title}</a>
                        </li>`;
            });
            //htmltitlemain
            const htmltitlemain = this.titlemain.map(item => {
                return `<a class="item-link" href="/">
                        <img class="lazyload" width="630" height="100" data-src="${item.img}" alt="banner">
                    </a>`;
            });

            $('.item-banner-content').html(htmlintro.join(''));
            $('.sth_title').html(htmlsttt.join(''));
            $('.sth_item-content').html(htmlstcontent.join(''));
            $('.wrapper-section-location').html(htmllocationOne.join(''));
            $('.ultili_title').html(htmllocationTwo.join(''));
            $('.video_title').html(htmlvideo.join(''));
            $('.grid_video__content .subtitle-content').html(htmlsubvd.join(''));
            $('.slide-timeline-1').html(htmltimeline1.join(''));
            $('.slide-timeline-2').html(htmltimeline2.join(''));
            $('.slide-timeline-3').html(htmltimeline3.join(''));
            $('#slider-slick-home').html(htmltienich.join(''));
            $('.htp-tablinks-el').html(htmltitletab.join(''));
            $('.grid_sth__content .place-title').html(htmltitlempp.join(''));
            $('.htp-tablinks-investment').html(htmlinves.join(''));
            $('.htp-tabcontents-investment .tab0.htp-tabcontent-inv .owl-carousel').html(htmltabin0.join('') + htmltabin1.join('') + htmltabin2.join('') + htmltabin3.join('') + htmltabin4.join(''));
            $('.homepage-banner-investment .item-banner .title').html(htmltitleinvestment.join(''));
            $('.new--head .new-title').html(htmltitlenews.join(''));
            $('.ft_description').html(htmlnoteconte.join(''));
            $('.pnewle-form h3.text-center').html(htmlfrtitle.join(''));
            $('.pnewle-form label.contactFormPhone').html(htmlfrphone.join(''));
            $('.pnewle-form label.contactFormName').html(htmlfrname.join(''));
            $('.pnewle-form label.contactFormEmail').html(htmlfremail.join(''));
            $('.pnewle-form label.contactFormBody').html(htmlfrnote.join(''));
            $('.pnewle-form button.btn-outline').html(htmlfrbtn.join(''));
            $('.brand-title').html(htmltitlepart.join(''));
            $('.nav-mobile-menu #menu-main-menu').html(htmlmenumobile.join(''));
            $('.title-banner-main').html(htmltitlemain.join(''));


        },
        start: function () {
            this.renderMenuLeftEn();
            this.renderMenuRightEn();
            this.renderAllEn();
        }
    }

    if (localStorage.getItem('template') == 'vi') {
        app.start();
    }
    if (localStorage.getItem('template') == 'en') {
        appen.start();
    }

    if ($(window).width() < 1024) {
        if (localStorage.getItem('template') == 'vi') {
            $('.lang-mobile').html('<span>EN</span>');
            $('.lang-mobile').addClass('change-en');
        } else if (localStorage.getItem('template') == 'en') {
            $('.lang-mobile').html('<span>VI</span>');
            $('.lang-mobile').addClass('change-vi');
        } else {
            $('.lang-mobile').html('<span>EN</span>');
            $('.lang-mobile').addClass('change-en');
        }
        $('.lang-mobile.change-en').on('click', function () {
            window.location = url;
            localStorage.setItem('template', 'en');
        });
        $('.lang-mobile.change-vi').on('click', function () {
            window.location = url;
            localStorage.setItem('template', 'vi');
        });
    }
})