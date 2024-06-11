import { Component } from '@angular/core';
import { DoctorsService } from '../doctors.service';
import { GlobalServiceService } from '../../global-service.service';
import { Idsmodel } from '../idsmodel.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.css'
})
export class AppointmentComponent {
constructor(public srv:DoctorsService,public idFromServer:GlobalServiceService){}
Did=this.idFromServer.pId;
adpIds:Idsmodel;

onlyShowGetMedicalRecords:boolean=true;
   
    ngOnInit()
    {
      this.getAppointmentList(this.Did);
    }

    getAppointmentList(id)
    {
      this.srv.viewAppointments(id);
    }

   delRecord(id:number)
   {
    if(confirm("Are You sure to cancel appointment"))
    {
      this.srv.deleteAppointment(id).subscribe(
      () => {
        alert("Appointment Cancellation Successfull");
        this.srv.appointment;
      },
      err => {(alert('Error'+err))})
    }
   }

   isDateGreaterThanToday(date: Date): boolean {
    const today = new Date();
    return new Date(date) > today;
  }

  get(id: number) {
    this.srv.getAllIds(id).subscribe((data: Idsmodel) => 
    {
      this.adpIds = data;
    });
    this.resetForm();
    

    this.onlyShowGetMedicalRecords=false;
   }

   resetForm(form?:NgForm)
  {
    if(form!=null)
    {
      form.form.reset();
    }
    else
    {
      this.srv.medicalRecords={ 
        RecordId:0,
        AppointmentId:this.adpIds.AppointmentId,
        PatientId:this.adpIds.PatientId,
        DoctorId:this.adpIds.DoctorId,
        Symptoms:'',
        PhysicalExamination:'',
        TreatmentPlan:'',
        TestsRecommended:'',
        Prescription:''
      }
    }
  }

  onSubmit(form:NgForm)
  {
    this.PostRecord (form);
   this.onlyShowGetMedicalRecords=true;
   
   this.resetForm()
  }

  PostRecord(form:NgForm)
   {
    this.srv.PostMedicalRecord().subscribe(
      res=>{
        this.resetForm(form);
        alert("Added consultation Details");
      },
      err => {
        alert("Error:"+err)
      }
    )
   }
}