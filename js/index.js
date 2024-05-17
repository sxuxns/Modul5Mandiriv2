$(document).ready(function() {
    const token = localStorage.getItem('token');

    if (token) {
        $(".register-btn").hide();
        $(".logout-btn").show();
        $(".login-btn").hide();
    } else {
        $(".login-btn").show();
        $(".register-btn").show();
        $(".logout-btn").hide();
    }

    $(".logout-btn").click(function() {
        localStorage.removeItem('token');
        window.location.href = 'pages/login.html';
    });

    let products = [];
    let editIndex = -1;

    function fetchProducts() {
        $.ajax({
            url: 'https://localhost:7131/products',
            method: 'GET',
            success: function(data) {
                products = data;
                renderTable(products); // Memanggil renderTable dengan data yang diterima
            },
            error: function() {
                alert('Gagal mengambil data produk');
            }
        });
    }

    function renderTable(data) {
        const tbody = $("#productTableBody");
        tbody.empty();
        data.forEach((product, index) => {
            tbody.append(`
                <tr>
                    <td class="border px-4 py-2">${index + 1}</td>
                    <td class="border px-4 py-2">${product.name}</td>
                    <td class="border px-4 py-2">${product.price}</td>
                    <td class="border px-4 py-2">${product.stock}</td>
                    <td class="border px-4 py-2 flex justify-center">
                        <button class="btn-secondary p-2 rounded mr-2 editBtn" data-id="${product.id}" data-index="${index}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-secondary p-2 rounded deleteBtn" data-id="${product.id}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>
            `);
        });

        $(".editBtn").click(function() {
            editIndex = $(this).data("index");
            const product = products[editIndex];
            $("#productId").val(product.id);
            $("#productName").val(product.name);
            $("#productPrice").val(product.price);
            $("#productStock").val(product.stock);
            $("#modalTitle").text("Update Produk");
            $("#productModal").removeClass("hidden").addClass("flex");
        });

        $(".deleteBtn").click(function() {
            const id = $(this).data("id");
            $.ajax({
                url: `https://localhost:7131/products/${id}`,
                method: 'DELETE',
                success: function() {
                    fetchProducts();
                },
                error: function() {
                    alert('Gagal menghapus produk');
                }
            });
        });
    }

    $("#searchInput").on("input", function() {
        const name = $(this).val().trim();
        fetchData({ name: name });
    });

    $("#openFilterModalBtn").click(function() {
        $("#filterModal").removeClass("hidden").addClass("flex");
    });

    $("#closeFilterModalBtn").click(function() {
        $("#filterModal").removeClass("flex").addClass("hidden");
    });

    $("#filterFormModal").submit(function(event) {
        event.preventDefault();
        const nameFilter = $("#nameFilter").val().trim();
        const priceMin = $("#priceMin").val().trim();
        const priceMax = $("#priceMax").val().trim();
        const stockMin = $("#stockMin").val().trim();
        const stockMax = $("#stockMax").val().trim();

        const filter = {};
        if (nameFilter) {
            filter.name = nameFilter;
        }
        if (priceMin) {
            filter.priceMin = parseInt(priceMin);
        }
        if (priceMax) {
            filter.priceMax = parseInt(priceMax);
        }
        if (stockMin) {
            filter.stockMin = parseInt(stockMin);
        }
        if (stockMax) {
            filter.stockMax = parseInt(stockMax);
        }
        fetchData(filter);
        $("#filterModal").removeClass("flex").addClass("hidden");
    });

    function fetchData(params) {
        const queryString = $.param(params);
        $.ajax({
            url: `https://localhost:7131/products?${queryString}`,
            method: 'GET',
            success: function(data) {
                renderTable(data);
            },
            error: function() {
                alert('Gagal mengambil data produk');
            }
        });
    }

    $("#openModalBtn").click(function() {
        $("#productId").val('');
        $("#productName").val('');
        $("#productPrice").val('');
        $("#productStock").val('');
        $("#modalTitle").text("Tambah Produk");
        $("#productModal").removeClass("hidden").addClass("flex");
    });

    $("#closeModalBtn").click(function() {
        $("#productModal").removeClass("flex").addClass("hidden");
    });

    $("#saveProductBtn").click(function() {
        const id = $("#productId").val();
        const name = $("#productName").val();
        const price = $("#productPrice").val();
        const stock = $("#productStock").val();

        if (name && price && stock) {
            const productData = { name, price, stock };
            const token = localStorage.getItem('token');

            if (!token) {
                alert("Anda harus login untuk menambah atau mengubah data produk");
                return;
            }

            const headers = {
                'Authorization': `Bearer ${token}`
            };

            if (id) {
                $.ajax({
                    url: `https://localhost:7131/products/${id}`,
                    method: 'PUT',
                    headers: headers,
                    contentType: 'application/json',
                    data: JSON.stringify(productData),
                    success: function() {
                        fetchProducts();
                        $("#productModal").removeClass("flex").addClass("hidden");
                    },
                    error: function() {
                        alert('Gagal memperbarui produk');
                    }
                });
            } else {
                $.ajax({
                    url: 'https://localhost:7131/products',
                    method: 'POST',
                    headers: headers,
                    contentType: 'application/json',
                    data: JSON.stringify(productData),
                    success: function() {
                        fetchProducts();
                        $("#productModal").removeClass("flex").addClass("hidden");
                    },
                    error: function() {
                        alert('Gagal menambah produk');
                    }
                });
            }
        } else {
            alert("Semua kolom harus diisi!");
        }
    });

    fetchProducts(); // Panggil fetchProducts saat dokumen siap
});