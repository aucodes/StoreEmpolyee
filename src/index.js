(async function () {
    const data = await fetch("./src/data.json")
    const res = await data.json()
    
    let employees = res; //output from the backend
    let selectedEmployeeId = employees[0].id;
    let selectedEmployee = employees[0];
  
    const employeeList = document.querySelector(".employees__names--list");
    const employeeInfo = document.querySelector(".employees__single--info");
  
    // Add Employee - START
    const createEmployee = document.querySelector(".createEmployee");
    const addEmployeeModal = document.querySelector(".addEmployee");
    const addEmployeeForm = document.querySelector(".addEmployee_create");
    
    createEmployee.addEventListener("click", () => {
      addEmployeeModal.style.display = "flex"; //to display the form 
    });
  
    addEmployeeModal.addEventListener("click", (e) => {
      if (e.target.className === "addEmployee") { //to close the form- checking if clicked in the grey area.
        addEmployeeModal.style.display = "none";
      }
    });
  
    // Set Employee age to be entered minimum 18 years
    const dobInput = document.querySelector(".addEmployee_create--dob");
    dobInput.max = `${new Date().getFullYear() - 18}-${new Date().toISOString().slice(5, 10)}` //to show date before 2004 
  
    addEmployeeForm.addEventListener("submit", (e) => { // for submitting the form on clicking the submit button
      e.preventDefault(); // to prevent page refresh.
      const formData = new FormData(addEmployeeForm); // converting the form data. 
      const values = [...formData.entries()]; 
      const empData=[];
      values.forEach((val) => {
        empData[val[0]] = val[1]; //assigning values 
      });
      empData.id = employees[employees.length - 1].id + 1; // for getting the id. 
      empData.age =
        new Date().getFullYear() - parseInt(empData.dob.slice(0, 4), 10); 
      empData.imageUrl =
        empData.imageUrl || "https://cdn-icons-png.flaticon.com/512/0/93.png";
      employees.push(empData);
      renderEmployees();
      addEmployeeForm.reset(); // reset the form. 
      addEmployeeModal.style.display = "none"; //close the form. 
    });
    // Add Employee - END
  
    employeeList.addEventListener("click", (e) => { // concept of event elegation
      // Select Employee Logic - START
      if (e.target.tagName === "SPAN" && selectedEmployeeId !== e.target.id) {
        selectedEmployeeId = e.target.id;
        renderEmployees();
        renderSingleEmployee();
      }
      // Select Employee Logic - END
  
      // Employee Delete Logic - START
      if (e.target.tagName === "I") {  
        employees = employees.filter( //filter the current empolyees
          (emp) => String(emp.id) !== e.target.parentNode.id
        );
        if (String(selectedEmployeeId) === e.target.parentNode.id) {
          selectedEmployeeId = employees[0]?.id || -1;
          selectedEmployee = employees[0] || {};
          renderSingleEmployee();
        }
        renderEmployees();
      }
      // Employee Delete Logic - END
    });
  
    // Render All Employees - START : To display list of employees.
    const renderEmployees = () => {
      employeeList.innerHTML = ""; // to check if the div is empty
      employees.forEach((emp) => {
        const employee = document.createElement("span"); //create a new element to add the information. 
        employee.classList.add("employees__names--item");
        if (parseInt(selectedEmployeeId, 10) === emp.id) { // selected empolyee is a bit darker in UI.
          employee.classList.add("selected");
          selectedEmployee = emp;
        }
        employee.setAttribute("id", emp.id);
        employee.innerHTML = `${emp.firstName} ${emp.lastName} <i class="employeeDelete">❌</i>`;
        employeeList.append(employee); // adding into the list
      });
    };
    // Render All Employees Logic - END
  
    // Render Single Employee Logic - START
    const renderSingleEmployee = () => {
      // Employee Delete Logic - START
      if (selectedEmployeeId === -1) { 
        employeeInfo.innerHTML = "";
        return;
      }
      // Employee Delete Logic - END
  
      employeeInfo.innerHTML = `
        <img src="${selectedEmployee.imageUrl}" />
        <span class="employees__single--heading">
        ${selectedEmployee.firstName} ${selectedEmployee.lastName} (${selectedEmployee.age})
        </span>
        <span>${selectedEmployee.address}</span>
        <span>${selectedEmployee.email}</span>
        <span>Mobile - ${selectedEmployee.contactNumber}</span>
        <span>DOB - ${selectedEmployee.dob}</span>
      `;
    };
    // Render Single Employee Logic - END
  
    renderEmployees();
    if (selectedEmployee) renderSingleEmployee();
  })()