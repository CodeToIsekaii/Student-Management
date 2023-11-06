//constructor functioon và kế thừa = prototype
//cần quản lý sinh viên
function Student(name, birthday) {
  this.name = name;
  this.birthday = birthday;
  this.id = new Date().toISOString();
}

// -----------Store----------------
function Store() {}
//getStudents: lấy danh sách sinh viên (students) từ localstorage
Store.prototype.getStudents = function () {
  return JSON.parse(localStorage.getItem("students")) || [];
};
//add: nhận newStudent và nhét newStudent vào danh sách sinh viên
Store.prototype.add = function (newStudent) {
  // lấy danh sách sinh viên từ localStorage
  const students = this.getStudents();
  //nhét newStudent vào students
  students.push(newStudent);
  //lưu students vào localStorage
  localStorage.setItem("students", JSON.stringify(students));
};
//getStudent: nhận id, tìm sinh viên tuong ứng
Store.prototype.getStudent = function (id) {
  //lấy student về
  const students = this.getStudents();
  //tìm
  return students.find((student) => student.id == id);
};
//remove: nhận id, tìm sinh viên xóa xóa
Store.prototype.remove = function (id) {
  //lấy student về
  const students = this.getStudents();
  //tìm
  const indexRemove = students.findIndex((student) => student.id == id);
  //xóa
  students.splice(indexRemove, 1); //từ vị trí tìm đc xóa 1 thằng
  //cập nhật lên lại
  localStorage.setItem("students", JSON.stringify(students));
};
// -----------RenderUi------------
function RenderUI() {}
//add: thêm newStudent vào giao diện
RenderUI.prototype.add = function (newStudent) {
  //lấy danh sách sinh viên từ localstorage
  const students = new Store().getStudents();
  //tạo tr
  const newTr = document.createElement("tr");
  const { name, birthday, id } = newStudent;
  newTr.innerHTML = `
    <td>${students.length}</td>
    <td>${name}</td>
    <td>${birthday}</td>
    <td>
        <button class="btn btn-danger btn-sm btn-remove" data-id="${id}">
        Xóa
        </button>
    </td>
    `;
  // nhét vào tbody
  document.querySelector("tbody").appendChild(newTr);
  //xóa giá trị trên các ô input
  document.querySelector("#name").value = "";
  document.querySelector("#birthday").value = "";
};
RenderUI.prototype.alert = function (msg, type = "success") {
  //tạo div thông báo
  let divAlert = document.createElement("div");
  divAlert.className = `alert alert-${type}`;
  divAlert.innerHTML = msg;
  //nhét vào div notification
  document.querySelector("#notification").appendChild(divAlert);
  //sau 2 giây thì xóa div thông báo
  setTimeout(() => {
    divAlert.remove();
  }, 2000);
};
//renderUI: là hàm lấy students từ localStorage và render tất cả sinh viên lên ui
RenderUI.prototype.renderAll = function () {
  //1. Lấy danh sách sinh viên students từ localStorage
  const students = new Store().getStudents();
  //2. render tất cả student trong students lên ui
  //truy cập vào tbody và xóa trắng
  //duyệt students và biến student thành tr (reduce)
  const htmlContent = students.reduce(
    (total, currentStudent, indexCurrentStudent) => {
      const { name, birthday, id } = currentStudent;
      return (
        total +
        `
      <tr>
        <td>${indexCurrentStudent + 1}</td>
        <td>${name}</td>
        <td>${birthday}</td>
        <td>
          <button class="btn btn-danger btn-sm btn-remove" data-id="${id}">
            Xóa
          </button>
        </td>
      </tr>
      `
      );
    },
    ""
  );
  document.querySelector("tbody").innerHTML = htmlContent;
};
// -----------event-----------------
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault(); //chặn reset trang
  //lấy data từ input
  const name = document.querySelector("#name").value;
  const birthday = document.querySelector("#birthday").value;
  //từ giá trị thu đc tạo newStudent
  const newStudent = new Student(name, birthday);
  let store = new Store();
  let ui = new RenderUI();
  //lưu newStudent vào danh sách các sinh viên(students) trong localStorage
  store.add(newStudent);
  //hiện thị newStudent lên giao diện
  ui.add(newStudent);
  //hiện thông báo thêm thành công
  ui.alert(`Bạn vừa thêm thành công ${name}`);
});
//ôn reduce array method

//sự kiện load trang
document.addEventListener("DOMContentLoaded", (event) => {
  //renderAll: render tất cả sinh viên trong students lên ui
  const ui = new RenderUI();
  ui.renderAll();
});
//
document.querySelector("tbody").addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-remove")) {
    const idRemove = event.target.dataset.id;
    //getStudent: từ id remove tìm thông tin student tương ứng
    const store = new Store();
    const ui = new RenderUI();
    const student = store.getStudent(idRemove);
    const isConfirmed = confirm(`Bạn có chắc là muốn xóa ${student.name} ko?`);
    if (isConfirmed) {
      //1.xóa bên loclStorage(lun xóa này trước ròi xóa ui)
      store.remove(idRemove);
      //2. xóa bên ui
      ui.renderAll();
      //3. thông báo xóa thành công
      ui.alert(`Bạn đã xóa thành công ${student.name}`);
    }
  }
});
