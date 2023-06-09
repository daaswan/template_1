/* Required jQuery and ChartJS loaded first. */

var accent_color = "238,73,103";

// current testimonial index
var current_testimonial = 0;

// sample testimonial data
var testimonials = [{
    by: "John Doe",
    title: "Company CEO",
    content: "Etiam nisl leo, tempus a pretium a, varius vel libero. Aenean eros nisi, placerat ac augue ut, vulputate ultrices nibh. Morbi fermentum, velit quis placerat fringilla, lorem eros molestie tortor, non porta lectus purus in velit. Pellentesque commodo lacus vel nisl vehicula, a rutrum enim ornare.",
    image: {
        url: "https://via.placeholder.com/342x342?text=John+Doe",
        alt: "Lorem Ipsum"
    }
}, {
    by: "Johnny Doe",
    title: "Developer",
    content: "Etiam nisl leo, tempus a pretium a, varius vel libero. Aenean eros nisi, placerat ac augue ut, vulputate ultrices nibh. Morbi fermentum, velit quis placerat fringilla, lorem eros molestie tortor, non porta lectus purus in velit. Pellentesque commodo lacus vel nisl vehicula, a rutrum enim ornare.",
    image: {
        url: "https://via.placeholder.com/342x342?text=Johnny+Doe",
        alt: "Lorem Ipsum"
    }
}, {
    by: "Fedrick Doe",
    title: "Designer",
    content: "Etiam nisl leo, tempus a pretium a, varius vel libero. Aenean eros nisi, placerat ac augue ut, vulputate ultrices nibh. Morbi fermentum, velit quis placerat fringilla, lorem eros molestie tortor, non porta lectus purus in velit. Pellentesque commodo lacus vel nisl vehicula, a rutrum enim ornare.",
    image: {
        url: "https://via.placeholder.com/342x342?text=Fedrick+Doe",
        alt: "Lorem Ipsum"
    }
}, {
    by: "Jimmy Linsey",
    title: "Designer",
    content: "Etiam nisl leo, tempus a pretium a, varius vel libero. Aenean eros nisi, placerat ac augue ut, vulputate ultrices nibh. Morbi fermentum, velit quis placerat fringilla, lorem eros molestie tortor, non porta lectus purus in velit. Pellentesque commodo lacus vel nisl vehicula, a rutrum enim ornare.",
    image: {
        url: "https://via.placeholder.com/342x342?text=Jimmy+Linsey",
        alt: "Lorem Ipsum"
    }
}];

$(document).ready(function () {

    initScrollSpy();

    // initialize navigation
    initNav();

    // initialize carousel
    initCarousel()

    // set expertise chart
    var expertiseChart = new Chart($("#expertise-chart"), {
        type: 'bar',
        data: {
            labels: ["PHP", "Design", "SEO", "Branding"],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5],
                backgroundColor: [
                    'rgba(' + accent_color + ', 1)',
                    'rgba(' + accent_color + ', 1)',
                    'rgba(' + accent_color + ', 1)',
                    'rgba(' + accent_color + ', 1)',
                ],
                borderColor: [
                    'rgba(' + accent_color + ', 1)',
                    'rgba(' + accent_color + ', 1)',
                    'rgba(' + accent_color + ', 1)',
                    'rgba(' + accent_color + ', 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            events: [],
            legend: {
                display: false
            },
            tooltips: {
                enabled: false
            },
            ticks: {
                display: false
            },
            scales: {
                xAxes: [{
                    display: false
                }],
                yAxes: [{
                    display: false
                }]
            }
        }
    });

    /** Handle Testimonials */

    // set the first testimonial
    setTestimonial(testimonials[current_testimonial]);

    // handle prev button click
    $("#testimonial-prev").click(function (event) {
        if (current_testimonial == 0) {
            current_testimonial = testimonials.length - 1;
        } else {
            current_testimonial -= 1;
            current_testimonial %= testimonials.length;
        }
        setTestimonial(testimonials[current_testimonial]);
    });

    // handle next button click
    $("#testimonial-next").click(function (event) {
        current_testimonial += 1;
        current_testimonial %= testimonials.length;
        setTestimonial(testimonials[current_testimonial]);
    });

});


function initScrollSpy() {
    if (Modernizr.touchevents) {
        $("body").data("offset", 10);
    } else {
        $("body").data("offset", 25);
    }
}

function initNav() {
    if (Modernizr.touchevents) {
        touchNav();
    } else {
        nonTouchNav();
    }

}

function nonTouchNav() {}

function touchNav() {
    $(".touch-nav-toggler").on("click", function (event) {
        $("#touch-nav").toggleClass("open");
        $("#touch-nav-trigger").fadeToggle(1000);
        event.preventDefault();
    });

    $(".nav-link").on("click", function () {
        $("#touch-nav").toggleClass("open");
        $("#touch-nav-trigger").fadeToggle(1000);
    });
}


function initCarousel() {
    $(".my-carousel").owlCarousel({
        margin: 20,
        nav: true,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2,
                margin: 20
            },
            1200: {
                items: 3
            }
        }
    });
}

function setTestimonial(testimonial) {
    var image = $("#testimonial-image");
    var controls = $("#testimonial-controls");
    var content = $("#testimonial-content");
    var author = $("#testimonial-author");

    content.fadeOut("slow");
    author.fadeOut("slow");
    controls.fadeOut("slow");
    image.fadeOut("slow", function () {
        image.attr("src", testimonial.image.url);
    });

    image.one("load", function () {
        content.text(testimonial.content).fadeIn("fast");
        author.text(testimonial.by + ", " + testimonial.title).fadeIn("fast");
        image.fadeIn('fast');
        controls.fadeIn("fast");
    });
}