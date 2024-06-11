import { Component } from '@angular/core';
import { PatientserviceService } from '../patientservice.service';
import { Router } from '@angular/router';
import { GlobalServiceService } from '../../global-service.service';
import { Patient } from '../Patient.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-update-details',
  templateUrl: './update-details.component.html',
  styleUrl: './update-details.component.css'
})
export class UpdateDetailsComponent {
  constructor(public srv:PatientserviceService,public id:GlobalServiceService){
   
  }

  onlyShowGetPatients:boolean=true;
  patientId:number=null;
  patientList:Patient;
  ngOnInit(){
    this.patientId=this.id.pId;
    console.log(this.patientId);
    // this.getAllPatients();
    this.getPatientById()
   
  }
 
 
// getAllPatients(){
//   this.srv.getAllPatients().then((patients: Patient[]) => {
//     // this.patientList = patients;
//     patients.forEach(p => {
//       let temp = p;
//       temp.DOB = formatDate(p.DOB as Date, "yyyy-MM-dd", "en");
//       this.patientList.push(temp);
//     })
//     console.log(this.patientList);
 
//  }
// ).catch(
//   error => {
//      console.error("Error fetching Patients:", error);
//   }
// );
// }
 
getPatientById() {
  if (this.patientId) {
    this.srv.getById(this.patientId).subscribe(
      (patient: Patient) => {
        if(patient){
          this.patientList=patient;
        }
        else{
          alert(`patient with ID ${this.id} not found`)
        }
      },
      error => {
        if (error.status === 404) {
          alert("User not found");
        } else {
          console.error("Error fetching Patient by ID:", error);
        }
      }
    );
  } 
  else {
    alert("No records found with id " + this.patientId)
  }
}
 
  // getAppointmentList(id){
  //   this.srv.getAllAppointments(id);
  // }
 
  fillForm(p){
    this.onlyShowGetPatients=false;
    this.srv.patient=p;
   
  }
 
  delPatient(pId){
    if(confirm("Are you sure to delete this Patient details ?"))
    {
      this.srv.deletePatient(pId).subscribe(
        (res)=>
        {alert("Patient deletion successful");
        // this.getAllPatients();
      },
        err=>{
          alert("Error Occured!!!"+err);
        }
        );
 
    }
  }
  onSubmit(form){//we didnt add ng form her
    this.onlyShowGetPatients=true;
    this.updRecord(form);
    this.resetForm();
  }
  resetForm(form?:NgForm){// we added here
    if(form!=null){
      form.form.reset();
    }
    else{
      this.srv.patient = {
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
 
 
  updRecord(form:NgForm){
    this.srv.updatePatient().subscribe(res=>{this.resetForm(form);
    this.srv.getAllPatients();
  alert('Patient Details Updated!!!')},err=>{alert("Error!!!");})
  }
 
 

}
