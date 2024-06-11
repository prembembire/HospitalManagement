import { Component } from '@angular/core';
import { DoctorsService } from '../../DoctorsUseCase/doctors.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-admindoctorreg',
  templateUrl: './admindoctorreg.component.html',
  styleUrl: './admindoctorreg.component.css'
})
export class AdmindoctorregComponent {
  constructor(public dsv:DoctorsService){}

  ngOnInit()
  {
    this.resetForm();
  }


  resetForm(form?:NgForm){
    if(form!=null){
      form.form.reset();
    }
    else{
      this.dsv.doctors = {
        DoctorId:0,
        Name: '',
        Specialty: '',
        ExperienceYears:null,
        Qualification: '',
        Designation: '',
        UserName: '',
        Password: ''
    };
    
    }
  }

onSubmit(form){
  if(this.dsv.doctors.DoctorId==0){
    this.newRecord(form);
    //this.resetForm();
  }
  else{
    this.updRecord(form);
    this.resetForm();
  }
}
// newRecord(form:NgForm){
//   this.dsv.registerDoctor().subscribe(res=>{
//     this.resetForm();
//     this.dsv.getAllDoctors();
//     alert("Doctor registration successful !!.Now you can login with your credentials.");
    
//   })

// }
newRecord(form:NgForm){
  this.dsv.registerDoctor().subscribe(
    res=>{
    this.resetForm();
    this.dsv.getAllDoctors();
    alert("Doctor registration successful !!.Now you can login with your credentials.");
    // localStorage.removeItem("jwt");
  },
  error => {
    if(error.error === "UserName already exists. Please choose a different username") {
      alert("UserName already exists. Please choose a different username");
    }
    else {
      alert("An error occured:"+error.message);
      console.error("An error occured:", error);
    }
  }
)
};

updRecord(form:NgForm){
  this.dsv.updateDoctor().subscribe(res=>{this.resetForm(form);
  this.dsv.getAllDoctors();
alert('Doctor Updated!!!')},err=>{alert("Error!!!");})
}

}










// import { Component } from '@angular/core';
// import { DoctorsService } from '../../DoctorsUseCase/doctors.service';
// import { NgForm } from '@angular/forms';

// @Component({
//   selector: 'app-register-doctor',
//   templateUrl: './register-doctor.component.html',
//   styleUrl: './register-doctor.component.css'
// })
// export class RegisterDoctorComponent {
//   constructor(public dsv:DoctorsService){}

//   ngOnInit()
//   {
//     this.resetForm();
//   }


//   resetForm(form?:NgForm){
//     if(form!=null){
//       form.form.reset();
//     }
//     else{
//       this.dsv.doctors = {
//         DoctorId:0,
//         Name: '',
//         Specialty: '',
//         ExperienceYears:null,
//         Qualification: '',
//         Designation: '',
//         UserName: '',
//         Password: ''
//     };
    
//     }
//   }

// onSubmit(form){
//   if(this.dsv.doctors.DoctorId==0){
//     this.newRecord(form);
//     this.resetForm();
//   }
//   else{
//     this.updRecord(form);
//     this.resetForm();
//   }
// }
// newRecord(form:NgForm){
//   this.dsv.registerDoctor().subscribe(res=>{
//     this.resetForm();
//     this.dsv.getAllDoctors();
//     alert("Doctor registration successful !!.Now you can login with your credentials.");
//     localStorage.removeItem("jwt");
//     //this.router.navigate(['RedirectToAdminNav'])
//   })

// }


// updRecord(form:NgForm){
//   this.dsv.updateDoctor().subscribe(res=>{this.resetForm(form);
//   this.dsv.getAllDoctors();
// alert('Doctor Updated!!!')},err=>{alert("Error!!!");})
// }

// }