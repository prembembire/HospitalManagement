
import { Component } from '@angular/core';
import { MedRecServiceService } from '../../DoctorUseCase/med-rec-service.service';
import { MedicalRecords } from '../medical-records.model';
import { NgClass, NgFor } from '@angular/common';
import { NgForm } from '@angular/forms';
import { GlobalServiceService } from '../../global-service.service';

@Component({
  selector: 'app-manage-records',
  templateUrl: './manage-records.component.html',
  styleUrl: './manage-records.component.css'
})
export class ManageRecordsComponent {
   constructor(public srv:MedRecServiceService, public psv:GlobalServiceService){}

   onlyShowGetMedicalRecords:boolean=true;
   RecordId=this.psv.pId;
   medList:MedicalRecords[];

   ngOnInit()
   {
    this.getMedicalRecordById()
   }

   getAllMedicalRecords()
   {
    this.srv.getAllMedicalRecords().then(
      (list:MedicalRecords[]) => {
        this.medList=list;
      }
    ).catch(
      error => {
        console.error("Error Fetching MedicalRecords:",error)
      }
    )
   }

   getMedicalRecordById() {
    if (this.RecordId) {
      this.srv.getMedicalRecordById(this.RecordId).subscribe(
        (medRecords: MedicalRecords[]) => {
          if (medRecords.length > 0) {
            this.medList = medRecords;
          } else {
            alert('No medical records found for this DoctorId');
          }
        },
        error => {
          if (error.status === 404) {
            alert("Medical records not found for this DoctorId");
          } else {
            console.error("Error fetching medical records: ", error);
          }
        }
      );
    } else {
      alert("Please provide a valid DoctorId");
    }
  }

   fillForm(newRec:MedicalRecords){
    this.onlyShowGetMedicalRecords=false;
    this.srv.list=newRec;
   }

   onSubmit(form:NgForm)
   {
    this.onlyShowGetMedicalRecords=true;
    this.updRecord (form);
    this.resetForm()
   }

   resetForm(form?:NgForm)
   {
    if(form!=null)
    {
      form.resetForm();
    }
    this.srv.list={
      RecordId:0,
      PatientId:null,
      DoctorId:null,
      AppointmentId:null,
      Symptoms:'',
      PhysicalExamination:'',
      TreatmentPlan:'',
      TestsRecommended:'',
      Prescription:''

    }
   }

   updRecord(form:NgForm)
   {
    this.srv.updateMedicalRecord().subscribe(
      res=>{
        this.resetForm(form);
        // this.getAllMedicalRecords();
        alert("Medical Record Updated");
      },
      err => {
        alert("Error:"+err)
      }
    )
   }
}
