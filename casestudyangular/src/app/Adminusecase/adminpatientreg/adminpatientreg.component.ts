import { Component } from '@angular/core';
import { PatientserviceService } from '../../patientusecase/patientservice.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-adminpatientreg',
  templateUrl: './adminpatientreg.component.html',
  styleUrl: './adminpatientreg.component.css'
})
export class AdminpatientregComponent {


  constructor(public psv:PatientserviceService){}

  ngOnInit(){
    this.resetForm();
  }


  resetForm(form?:NgForm){
    if(form!=null){
      form.form.reset();
    }
    else{
      this.psv.patient = {
        PatientId: 0,
        FullName: '',
        DOB: null,
        Gender: '',
        ContactNumber: '',
        UserName: '',
        Password: ''
    };
    
    }
  }

onSubmit(form){
  if(this.psv.patient.PatientId==0){
    this.newRecord(form);
    
  }
  else{
    this.updRecord(form);
    this.resetForm();
  }
}

newRecord(form: NgForm) {
  this.psv.registerPatient().subscribe(
    res => {
      this.resetForm();
      this.psv.getAllPatients();
      alert("Patient registration successful !!.Now you can login with your credentials.");
      
    },
    error => {
      
      if (error.error === "UserName already exists. Please choose a different username") {
        alert("UserName already exists. Please choose a different username");
      } else {
        alert("An error occurred: " + error.message);
        console.error("An error occurred:", error);
      }
    }
  );
}


updRecord(form:NgForm){
  this.psv.updatePatient().subscribe(res=>{this.resetForm(form);
  this.psv.getAllPatients();
alert('Patient Details Updated!!!')},err=>{alert("Error!!!");})
}

}







