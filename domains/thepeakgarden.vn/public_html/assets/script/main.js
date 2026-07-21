let slider_home = ""
let slider_plane = $('.htp-tabcontent img');
$(document).ready(function () {
    setTimeout(function () {
        slider_home = $("#slider-slick-home")[0].outerHTML.replace('id="slider-slick-home"', '');
        $('#slider-slick-home').owlCarousel({
            items: 5,
            loop: true,
            margin: 0,
            nav: true,
            dots: true,
            autoplay: true,
            autoplayTimeout: 10000,
            responsive: {
                0: {
                    items: 1
                },
                480: {
                    items: 1
                },
                600: {
                    items: 2
                },
                768: {
                    items: 3
                },
                1024: {
                    items: 5
                }
            }
        });

        let owl_htp = $('.htp-tabcontent-inv .owl-carousel').owlCarousel({
            items: 1,
            loop: true,
            margin: 0,
            nav: true,
            dots: true,
            autoplay: false,
            autoplayTimeout: 10000,
            responsive: {
                0: {
                    items: 1
                },
                768: {
                    items: 1
                },
                1024: {
                    items: 1
                }
            }
        });
        owl_htp.on('changed.owl.carousel', function (event) {

            $('button.htp-tablink-inv').removeClass('active');
            $('button.htp-tablink-inv').eq(event.page.index).addClass('active');
        })
    }, 500)

    $('.htp-tabcontent .owl-carousel ').owlCarousel({
        items: 1,
        loop: true,
        margin: 0,
        nav: true,
        dots: true,
        autoplay: false,
        autoplayTimeout: 10000,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 1
            },
            1024: {
                items: 1
            }
        }
    });



    $('#owl-news').owlCarousel({
        items: 3,
        loop: true,
        margin: 10,
        nav: true,
        dots: false,
        autoplay: true,
        autoplayTimeout: 10000,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            1024: {
                items: 3
            }
        }
    });
    $('#owl-brand-logo').owlCarousel({
        items: 6,
        loop: true,
        margin: 20,
        nav: false,
        dots: true,
        autoplay: true,
        autoplayTimeout: 3000,
        responsive: {
            0: {
                items: 2
            },
            768: {
                items: 4
            },
            1024: {
                items: 6
            }
        }
    });

    function tab_custom(link, content) {
        $(link).on('click', function () {
            var id = $(this).data('id');
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
            $(content + '[data-id=' + id + ']').siblings().removeClass('active');
            $(content + '[data-id=' + id + ']').addClass('active');
        });
    }
    setTimeout(function () {
        if ($('.htp-tablink').length) {
            tab_custom('.htp-tablink', '.htp-tabcontent');
        }
        /*88 */

        if ($('.htp-tablink-inv').length) {
            tab_custom('.htp-tablink-inv', '.htp-tabcontent-inv');
        }
        $('.htp-tablinks-investment .htp-tablink-inv').click(function () {
            let indextab = $(this).attr('data-id').match(/\d/)[0];
            jQuery('.htp-tabcontents-investment .owl-dot:eq(' + indextab + ')').click()
        })
    }, 1000)

    $("#menu-open-mob").click(function () {
        $(".sub-head").toggleClass("active");
        $("#menu-open-mob").toggleClass("active");
    })
    $("#close-menu").click(function () {
        $(".sub-head").removeClass("active");
        $("#menu-open-mob").removeClass("active");
    })

    /* */
    let requestcount = 0;
    $('#formbaogia').submit(function (e) {
        e.preventDefault();
        if (localStorage.getItem('requestcount')) {
            requestcount = parseInt(localStorage.getItem('requestcount'))+1
            localStorage.setItem('requestcount', requestcount)
        } else {
            localStorage.setItem('requestcount', 1)
            requestcount = 1
        }
        //var self = $(this);
        if (requestcount <= 2) {
            $.ajax({
                type: "POST",
                url: 'https://script.google.com/macros/s/AKfycbzytlR5WP4jSZpRAVy4kw817QftJhRZ_sX_UU9Rx9AIpu7i1T_L/exec',
                data: $('#formbaogia').serialize(),
            }).always(function (data) {
                alert('Thông báo thành công');
            })
        }
        else{
            alert('Thông báo thành công !');
        }
        $('#formbaogia')[0].reset();
    });
    /* scroll top */

})
$('.htp-tabcontents img').click(function () {
    let $this = $(this)[0]

    imagepop($this, 2);


    return false
})




jQuery(document).on("click", ".nav-mobile-menu a", function () {
    $('#close-menu').click();
});

function imagepop($this, slide, slideindex) {
    let imageSrc = $($this).attr("src");
    let imageAlt = $($this).attr("alt");
    let scrolltop = document.documentElement.scrollTop
    if (slide <= 2) {

        let slides = '';

        if (slide == 1) {

            $(slider_home).find('img').each(function (index, a) {
                slides += `
                <img src="${$(this).attr('src')}" >`
            })
        } else {
            slider_plane.each(function (index, a) {

                if ($(this).attr('src') == imageSrc) {

                    slideindex = index

                }
                slides += `
    <img src="${$(this).attr('src')}" >`
            })

        }
        let slider = `<div class="fotorama">
                
            ${slides}
                
            </div>`
        $('body').append(
            '<div class="imgal-modal">' +
            '<span id="imgal-modal-close"">X</span>' +
            slider +
            '</div'
        )

        let option = {
            startindex: slideindex,
            nav: 'thumbs'
        }
        if ($(window).width() > 1000) {
            option.height = "100%"
        }
        let $fotoramaDiv = $('.fotorama').fotorama(option);
        let fotorama = $fotoramaDiv.data('fotorama');

        jQuery('html, body').animate({
            scrollTop: scrolltop
        }, 10);
    } else if (slide == 3) {
        $('body').append(
            '<div class="imgal-modal">' +
            '<span id="imgal-modal-close"">X</span>' +
            ' <iframe class="videoytb" style="max-width:100%" width="560" height="315" src="https://www.youtube.com/embed/nUR1TIjL4BE?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' +
            '</div'
        )
        if ($(window).width() > 1000) {
            $('.videoytb').each(function () {
                var maxWidth = $(window).width(); // Max width for the image
                var maxHeight = $(window).height(); // Max height for the image
                var ratio = 0; // Used for aspect ratio
                var width = $(this).width(); // Current image width
                var height = $(this).height(); // Current image height

                // Check if the current width is larger than the max
                if (maxWidth > width) {
                    ratio = maxWidth / width; // get ratio for scaling image
                    $(this).css("width", maxWidth); // Set new width
                    $(this).css("height", height * ratio); // Scale height based on ratio
                    height = height * ratio; // Reset height to match scaled image
                    width = width * ratio; // Reset width to match scaled image
                }

                // Check if current height is larger than max
                if (maxHeight > height) {
                    ratio = maxHeight / height; // get ratio for scaling image
                    $(this).css("height", maxHeight); // Set new height
                    $(this).css("width", width * ratio); // Scale width based on ratio
                    width = width * ratio; // Reset width to match scaled image
                    height = height * ratio; // Reset height to match scaled image
                }
            });
        }
    } else {
        $('body').append(
            '<div class="imgal-modal">' +
            '<span id="imgal-modal-close"">X</span>' +
            '<img src="' + imageSrc + '" alt="' + imageAlt + '" class="imgal-modal-img"></img>' +
            '</div'
        )
    }


    $('#imgal-modal-close').click(function () {
        $('.fotorama').remove()
        $('body').removeAttr('style');
        $('.imgal-modal').hide('fast', function () {
            $(this).remove();
        });
    });
}

jQuery(document).on("click", ".section-utili img", function () {
    let slides = $(slider_home);
    let img = slides.find('img[src="' + $(this).attr('src') + '"]')
    let index = slides.find('img').index(img)
    imagepop(this, 1, index);
});
jQuery(document).on("click", ".video-responsive img", function () {
    imagepop(this, 3);
});
//Click event to scroll to top
jQuery(document).on("click", ".back-to-top", function () {
    jQuery('html, body').animate({
        scrollTop: 0
    }, 300);
});
jQuery(document).on("click", "a", function () {
    if ($(this).attr('href') == '/') {
        return false;
    }
});
jQuery(window).scroll(function () {
    /* scroll header */
    if (jQuery(window).width() < 768) {
        var scroll = $(window).scrollTop();
        if (scroll < 99) {
            $(".main-header").removeClass("scroll-menu");
            jQuery('body').css('padding-top', '0px');
        } else {
            $(".main-header").addClass("scroll-menu");
            jQuery('body').css('padding-top', '99px');
        }
    } else {
        var height_header = $('.main-header').height();
        if (jQuery(window).scrollTop() >= height_header) {
            jQuery('.main-header').addClass('affix-mobile');
            jQuery('body').css('padding-top', '79px');
        } else {
            jQuery('.main-header').removeClass('affix-mobile');
            jQuery('body').css('padding-top', '0px');
        }
    }
});