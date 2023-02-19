const connection = require('../../connectDB');

function format_date(date) {
    return date.getFullYear() + "/" +
    ("0" + (date.getMonth()+1)).slice(-2) + "/" +
    ("0" + date.getDate()).slice(-2) + " " +
    ("0" + date.getHours()).slice(-2) + ":" +
    ("0" + date.getMinutes()).slice(-2) + ":" +
    ("0" + date.getSeconds()).slice(-2);
}

let getspDB = (callback) => {
    connection.query(
        'SELECT sanpham.ID, ID_LoaiSanPham, xuatxu.ID as ID_XuatXu, loaisanpham.Ten as LoaiSanPham, imgName, Image, TenSanPham, GiaNhap, GiaBan, SoLuong, NgayNhap, sanpham.update_at, xuatxu.XuatXu, show_sp, show_lsp, show_xx FROM sanpham INNER JOIN loaisanpham ON loaisanpham.ID = sanpham.ID_LoaiSanPham INNER JOIN xuatxu ON xuatxu.ID = sanpham.XuatXu ; ' + 
        'SELECT ID, Ten as LoaiSanPham FROM loaisanpham ; ' + 
        'SELECT ID, XuatXu FROM xuatxu ' ,
        function(err, results) {
            if(err) throw err;
            results[0].forEach(data => {
                data.NgayNhap = format_date(data.NgayNhap);
                data.update_at = format_date(data.update_at);
            });
            return callback(results);
        }
    );
}

function showDB(callback, id){
    connection.query(
        'UPDATE sanpham SET show_sp = 1 WHERE ID = ? ',
        [id],
        function(err, results) {
            if(err) throw err;
            return callback(results);
        }

    )
}

function hiddenDB(callback, id){
    connection.query(
        'UPDATE sanpham SET show_sp = 0 WHERE ID = ? ',
        [id],
        function(err, results) {
            if(err) throw err;
            return callback(results);
        }
    )
}

let createspDB = (callback, dataCreate) => {
    connection.query(
        'INSERT INTO `sanpham`(`ID_LoaiSanPham`, `imgName`, `Image`, `TenSanPham`, `GiaNhap`, `GiaBan`, `SoLuong`, `NgayNhap`, `update_at`, `XuatXu`) VALUES(?, ?, ?, ?, ?, ?, ?, now(), now(), ?)',
        [dataCreate.loaiSp, dataCreate.imgName, dataCreate.image, dataCreate.tenSp, dataCreate.giaNhap, dataCreate.giaBan, dataCreate.soLuong, dataCreate.xuatXu],
        function(err, results) {
            if(err) {
                console.error(err.stack);
                throw err;
            }
            return callback(results);
        }
    );
}

let updatespDB = (callback, dataUpdate, idSp) => {
    if (!dataUpdate.image){
        // console.log("Không có file");
        connection.query(
            'UPDATE sanpham SET ID_LoaiSanPham = ?, TenSanPham = ?, GiaNhap = ?, GiaBan = ?, SoLuong = ?, update_at = now(), XuatXu = ? WHERE ID = ?', 
            [dataUpdate.loaiSp, dataUpdate.tenSp, dataUpdate.giaNhap, dataUpdate.giaBan, dataUpdate.soLuong, dataUpdate.xuatXu, idSp],
            function(err, results) {
                if(err) throw err;
                return callback(results);
            }
        );
    }else{
        // console.log(" có file");
        connection.query(
            'UPDATE sanpham SET ID_LoaiSanPham = ?, imgName = ?, Image = ?, TenSanPham = ?, GiaNhap = ?, GiaBan = ?, SoLuong = ?, update_at = now(), XuatXu = ? WHERE ID = ?', 
            [dataUpdate.loaiSp, dataUpdate.imgName, dataUpdate.image, dataUpdate.tenSp, dataUpdate.giaNhap, dataUpdate.giaBan, dataUpdate.soLuong, dataUpdate.xuatXu, idSp],
            function(err, results) {
                if(err) throw err;
                return callback(results);
            }
        );
    }
    
}

let deletespDB = (callback, idSp) => {
    connection.query(
        'DELETE FROM `sanpham` WHERE ID = ?', [idSp],
        function(err, results) {
            if(err) throw err;
            return callback(results);
        }
    );
}

module.exports = {
    getspDB, createspDB, updatespDB, deletespDB, showDB, hiddenDB
}