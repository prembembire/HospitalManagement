

import { Component } from '@angular/core';
import { PatientserviceService } from '../patientservice.service';
import { NgForm } from '@angular/forms';
import { DoctorsService } from '../../DoctorsUseCase/doctors.service';
import { Doctors } from '../../DoctorsUseCase/modelclass.model';
import { GlobalServiceService } from '../../global-service.service';

@Component({
  selector: 'app-book-appointments',
  templateUrl: './book-appointments.component.html',
  styleUrls: ['./book-appointments.component.css']
})
export class BookAppointmentsComponent {
  constructor(public srv: PatientserviceService, private avlDoc: DoctorsService, private glbpat: GlobalServiceService) {}
  docList: Doctors[];
  showForm: boolean = false;
  patId: number;
  docId: number;
  availableTimeSlots: string[];
  appDate:Date;
  selectedTimeSlot: string;


  ngOnInit() {
    this.patId = this.glbpat.pId;
    this.getAllDoctors();
    this.resetForm();
  }

  bookAppointment(id: number) {
    this.showForm = true;
    this.docId = id;
    this.srv.bookApp.PatientId = this.patId;
    this.srv.bookApp.DoctorId = id;
  }

  resetForm(form?: NgForm) {
    if (form != null) {
      form.resetForm();
    } else {
      this.srv.bookApp = {
        AppointmentId: 0,
        PatientId: this.patId,
        DoctorId: this.docId,
        AppointmentDate: null,
        Status: 'confirmed',
        VisitType: ''
      }
    }
  }

  getAllDoctors() {
    this.avlDoc.getAllDoctors().then(
      (doctors: Doctors[]) => {
        this.docList = doctors;
      }
    ).catch(
      error => {
        console.error("Error fetching doctors:", error);
      }
    )
  };

  fetchAvailableTimeSlots() {
    
    console.log(`The date is: ${this.srv.bookApp.AppointmentDate}`);

    
    const appointmentDate = new Date(this.srv.bookApp.AppointmentDate);
    console.log(`The date is: ${appointmentDate}`);

    this.srv.getAvailableTimeSlots(this.docId, appointmentDate).subscribe(
        (response: any) => {
            this.availableTimeSlots = response.availableTimeSlots;
            console.log("Available time slots:", this.availableTimeSlots);
        },
        error => {
            console.error("Error fetching available time slots:", error);
        }
    );
}





  OnSubmit(form: NgForm) {
    if (this.srv.bookApp.AppointmentId == 0) {
      
      const combinedDateTime = `${this.srv.bookApp.AppointmentDate} ${this.selectedTimeSlot}`;
      
      const combinedDateTimeObj = new Date(combinedDateTime);
      
      this.srv.bookApp.AppointmentDate = combinedDateTimeObj;
      
      this.insertRecord(form);
      this.resetForm();
      this.showForm = false;
    }
  }
  

  insertRecord(form: NgForm) {
    this.srv.BookAppointment().subscribe(res => {
      this.resetForm(form);
      alert("Booking Successful");
      this.showForm = false;
    },
      err => {
        alert('There is something wrong happened try again later')
      })
  }












  minDate(): string {
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    
    const yyyy = tomorrow.getFullYear();
    let mm: string | number = tomorrow.getMonth() + 1;
    let dd: string | number = tomorrow.getDate();

    
    if (mm < 10) {
      mm = '0' + mm;
    }
    if (dd < 10) {
      dd = '0' + dd;
    }

    
    return `${yyyy}-${mm}-${dd}`;
  }
}
































