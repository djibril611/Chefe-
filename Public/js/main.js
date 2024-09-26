(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.navbar').addClass('sticky-top shadow-sm');
        } else {
            $('.navbar').removeClass('sticky-top shadow-sm');
        }
    });
    
    
    // Dropdown on mouse hover
    const $dropdown = $(".dropdown");
    const $dropdownToggle = $(".dropdown-toggle");
    const $dropdownMenu = $(".dropdown-menu");
    const showClass = "show";
    
    $(window).on("load resize", function() {
        if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
            function() {
                const $this = $(this);
                $this.addClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "true");
                $this.find($dropdownMenu).addClass(showClass);
            },
            function() {
                const $this = $(this);
                $this.removeClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "false");
                $this.find($dropdownMenu).removeClass(showClass);
            }
            );
        } else {
            $dropdown.off("mouseenter mouseleave");
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: true,
        margin: 24,
        dots: true,
        loop: true,
        nav : false,
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });
    
})(jQuery);





// main.js

document.addEventListener("DOMContentLoaded", function() {
    // Display blog posts on the blog page
    if (document.getElementById('blog-container')) {
        fetch('blog.json')
            .then(response => response.json())
            .then(data => {
                const blogContainer = document.getElementById('blog-container');
                data.blogs.forEach(blog => {
                    const blogPost = `
                        <div class="col-md-6 col-lg-4">
                            <div class="card mb-4 blog-post">
                                <img src="${blog.image}" class="card-img-top" alt="${blog.title}">
                                <div class="card-body">
                                    <h5 class="card-title">${blog.title}</h5>
                                    <p class="card-text">${blog.content}</p>
                                </div>
                            </div>
                        </div>
                    `;
                    blogContainer.innerHTML += blogPost;
                });
            })
            .catch(error => console.error('Error loading blogs:', error));
    }

    // Add new blog post on the admin page
    if (document.getElementById('blog-form')) {
        document.getElementById('blog-form').addEventListener('submit', function(event) {
            event.preventDefault();

            const title = document.getElementById('title').value;
            const content = document.getElementById('content').value;
            const image = document.getElementById('image').value;

            const newBlog = {
                title: title,
                content: content,
                image: image
            };

            // Fetch existing blogs
            fetch('blog.json')
                .then(response => response.json())
                .then(data => {
                    // Add new blog to blogs array
                    data.blogs.push(newBlog);

                    // Convert updated blogs array back to JSON string
                    const updatedBlogs = JSON.stringify(data);

                    // This part requires a server-side script to save updatedBlogs to blog.json
                    console.log(updatedBlogs);

                    // Reset form
                    document.getElementById('blog-form').reset();
                })
                .catch(error => console.error('Error adding blog:', error));
        });
    }
});

// main.js

document.addEventListener("DOMContentLoaded", function() {
    const blogContainer = document.getElementById('blogPosts');
    const blogTable = document.getElementById('blogTable');
    const totalPosts = document.getElementById('totalPosts');
    const totalVisitors = document.getElementById('totalVisitors');
    const popularPost = document.getElementById('popularPost');
    const avgTimeSpent = document.getElementById('avgTimeSpent');
    const imageUpload = document.getElementById('imageUpload');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const featuredImageSelect = document.getElementById('featuredImage');

    // Placeholder data for metrics
    const metrics = {
        visitors: 1200,
        popularPost: "Traditional Delicacies",
        avgTimeSpent: 5.4
    };

    // Placeholder data for blog metrics
    const blogMetrics = [
        { views: 120, comments: 8, likes: 30 },
        { views: 200, comments: 12, likes: 50 },
        { views: 90, comments: 4, likes: 20 }
        // Add more metrics for each blog post as needed
    ];

    // Fetch and display blog posts on the blog page and admin page
    fetch('blog.json')
        .then(response => response.json())
        .then(data => {
            // Display on blog page
            if (blogContainer) {
                data.blogs.forEach(blog => {
                    const blogPost = document.createElement('div');
                    blogPost.className = 'col-md-6 col-lg-4';
                    blogPost.innerHTML = `
                        <div class="card mb-4">
                            <img src="${blog.featuredImage}" class="card-img-top" alt="${blog.title}">
                            <div class="card-body">
                                <h5 class="card-title">${blog.title}</h5>
                                <p class="card-text">${blog.content.substring(0, 100)}...</p>
                                <a href="#" class="btn btn-primary">Read More</a>
                            </div>
                        </div>
                    `;
                    blogContainer.appendChild(blogPost);
                });
            }

            // Display on admin page
            if (blogTable) {
                data.blogs.forEach((blog, index) => {
                    const row = document.createElement('tr');
                    const { views, comments, likes } = blogMetrics[index] || { views: 0, comments: 0, likes: 0 };
                    row.innerHTML = `
                        <td>${blog.title}</td>
                        <td>${blog.content.substring(0, 50)}...</td>
                        <td>${blog.images.length} images</td>
                        <td><img src="${blog.featuredImage}" alt="${blog.title}" width="100"></td>
                        <td>${views}</td>
                        <td>${comments}</td>
                        <td>${likes}</td>
                        <td>
                            <button class="btn btn-warning btn-sm me-2" onclick="editBlog(${index})">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteBlog(${index})">Delete</button>
                        </td>
                    `;
                    blogTable.appendChild(row);
                });
                totalPosts.textContent = data.blogs.length;
                totalVisitors.textContent = metrics.visitors;
                popularPost.textContent = metrics.popularPost;
                avgTimeSpent.textContent = `${metrics.avgTimeSpent}m`;
            }
        })
        .catch(error => console.error('Error loading blogs:', error));

    // Handle image uploads and preview updates
    imageUpload.addEventListener('change', function() {
        imagePreviewContainer.innerHTML = '';
        featuredImageSelect.innerHTML = '';
        Array.from(imageUpload.files).forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imgElement = document.createElement('img');
                imgElement.src = e.target.result;
                imgElement.className = 'img-thumbnail m-2';
                imgElement.style.width = '100px';
                imagePreviewContainer.appendChild(imgElement);

                // Add to featured image options
                const option = document.createElement('option');
                option.value = e.target.result;
                option.textContent = `Image ${index + 1}`;
                featuredImageSelect.appendChild(option);
            };
            reader.readAsDataURL(file);
        });
    });

    // Handle form submission to add a new blog
    if (document.getElementById('blogForm')) {
        document.getElementById('blogForm').addEventListener('submit', function(event) {
            event.preventDefault();

            const title = document.getElementById('title').value;
            const content = document.getElementById('content').value;
            const images = Array.from(imageUpload.files).map(file => URL.createObjectURL(file));
            const featuredImage = document.getElementById('featuredImage').value;
            const imagePosition = document.getElementById('imagePosition').value;

            // Here you would typically send the new blog data to your backend server to save it
            console.log('New Blog Post:', { title, content, images, featuredImage, imagePosition });

            // Reset form
            document.getElementById('blogForm').reset();
            imagePreviewContainer.innerHTML = '';
            featuredImageSelect.innerHTML = '';
            alert('Blog post added successfully!');
        });
    }
});

// Functions to edit and delete blog posts (to be implemented)
function editBlog(index) {
    alert(`Edit blog post at index ${index}`);
    // Implement editing functionality
}

function deleteBlog(index) {
    alert(`Delete blog post at index ${index}`);
    // Implement delete functionality
}

document.addEventListener("DOMContentLoaded", function () {
    let isAmharic = false;

    document.getElementById('toggle-amharic').addEventListener('click', function () {
        isAmharic = !isAmharic;
        this.textContent = isAmharic ? 'Show in English' : 'Show in Amharic';

        // Toggle Amharic menu items
        document.querySelectorAll('.menu-item').forEach(item => {
            item.querySelector('.name-en').style.display = isAmharic ? 'none' : 'block';
            item.querySelector('.name-am').style.display = isAmharic ? 'block' : 'none';
        });
    });

    fetch('menu.json')
        .then(response => response.json())
        .then(data => {
            const foodItems = data.menuItems.food;
            const drinkItems = data.menuItems.drinks;

            createMenuItems(foodItems, 'food-menu-left', 'food-menu-right', isAmharic);
            createMenuItems(drinkItems, 'drink-menu-left', 'drink-menu-right', isAmharic);
        })
        .catch(error => console.error('Error loading menu:', error));

        function createMenuItems(items, leftContainerId, rightContainerId, isAmharic) {
            const leftContainer = document.getElementById(leftContainerId);
            const rightContainer = document.getElementById(rightContainerId);
            
            items.forEach((item, index) => {
                let priceDisplay = '';
        
                // If the item is a food item, use the 'price' field
                if (item.price) {
                    priceDisplay = `${item.price} ETB`;
                }
                // If the item is a drink, use 'normalPrice' and 'vipPrice'
                else if (item.normalPrice && item.vipPrice) {
                    priceDisplay = `Normal: ${item.normalPrice} ETB, VIP: ${item.vipPrice} ETB`;
                } else {
                    priceDisplay = 'No Price';
                }
        
                const menuItem = `
                    <div class="menu-item d-flex align-items-center mb-4">
                        <img class="flex-shrink-0 img-fluid rounded" src="${item.image}" alt="${item.nameEn}" style="width: 80px;">
                        <div class="w-100 d-flex flex-column text-start ps-4">
                            <h5 class="d-flex justify-content-between border-bottom pb-2">
                                <span class="name-en" style="display: ${isAmharic ? 'none' : 'block'}">
                                    <a href="/menu_detail?name=${item.nameEn}" style="text-decoration: none; color: inherit;">
                                        ${item.nameEn}
                                    </a>
                                </span>
                                <span class="name-am" style="display: ${isAmharic ? 'block' : 'none'}">
                                    <a href="/menu_detail?name=${item.nameAm}" style="text-decoration: none; color: inherit;">
                                        ${item.nameAm}
                                    </a>
                                </span>
                                <span class="text-primary">${priceDisplay}</span>
                            </h5>
                            <small class="fst-italic">${item.description || 'No description available.'}</small>
                        </div>
                    </div>
                `;
        
                if (index % 2 === 0) {
                    leftContainer.innerHTML += menuItem;
                } else {
                    rightContainer.innerHTML += menuItem;
                }
            });
        }
        
});

window.addEventListener('scroll', function() {
    let navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    let navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            if (!navbar.classList.contains('scrolled')) {
                navbar.classList.add('scrolled');
            }
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});
