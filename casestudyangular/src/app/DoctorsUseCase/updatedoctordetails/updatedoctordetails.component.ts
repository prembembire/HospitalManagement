import { Component } from '@angular/core';
import { DoctorsService } from '../doctors.service';
import { Doctors } from '../modelclass.model';
import { NgForm } from '@angular/forms';
import { GlobalServiceService } from '../../global-service.service';

@Component({
  selector: 'app-updatedoctordetails',
  templateUrl: './updatedoctordetails.component.html',
  styleUrl: './updatedoctordetails.component.css'
})
export class UpdatedoctordetailsComponent {
  onlyShowGetDoctors: boolean = true;
  doctorId: number = null;
  doctorLst: Doctors;

  
  





  constructor(public srv: DoctorsService,public id:GlobalServiceService) {}

  ngOnInit() {
    this.doctorId=this.id.pId;
    this.getDoctorById();
    window.addEventListener('click', this.closeModalOutside.bind(this));
  }

  // getAllDoctors() {
  //      this.srv.getAllDoctors().then(
  //         (doctors: Doctors[]) => {
  //            this.doctorLst = doctors;
  //         }
  //      ).catch(
  //         error => {
  //            console.error("Error fetching doctors:", error);
  //         }
  //      );
  //   }
    
    getDoctorById() {
     if (this.doctorId) {
       this.srv.getDoctorById(this.doctorId).subscribe(
         (doctor: Doctors) => {
           if (doctor) {
             this.doctorLst = doctor;
           } else {
             alert(`Doctor with ID ${this.doctorId} not found.`);
           }
         },
         error => {
           if (error.status === 404) {
             alert("Doctor not found");
           } else {
             console.error("Error fetching doctor by ID:", error);
           }
         }
       );
     }  else {
       alert("No records found with ID " + this.doctorId);
     }
   }

      fillForm(doctor: Doctors) {
         this.onlyShowGetDoctors = false;
         this.srv.doctors = doctor;
      }

      
   
      onSubmit(form: NgForm) {
         this.onlyShowGetDoctors = true;
         this.updRecord(form);
         this.resetForm();
      }
   
      resetForm(form?: NgForm) {
         if (form != null) {
            form.resetForm();
         }
         this.srv.doctors = {
            DoctorId: 0,
            Name: '',
            Specialty: null,
            ExperienceYears: null,
            Qualification: '',
            Designation:'',
            UserName: '',
            Password: ''
         };
      }
   
      updRecord(form: NgForm) {
         this.srv.updateDoctor().subscribe(
            res => {
               this.resetForm(form);
              //  this.getAllDoctors();
               alert('Doctor Details Updated!!!');
            },
            err => {
               alert("Error: " + err);
            }
         );
      }
   

  
  showDoctorDetails(doctor: Doctors) {
    let modal = document.getElementById('doctorDetailsModal');
    let details = document.getElementById('doctorDetails');
    details.innerHTML = `Name: ${doctor.Name}<br>Specialty: ${doctor.Specialty}<br>Experience: ${doctor.ExperienceYears} years<br>Qualification: ${doctor.Qualification}<br>Designation: ${doctor.Designation}<br>Username: ${doctor.UserName}`;
    modal.style.display = 'block';
  }

  closeModal() {
    let modal = document.getElementById('doctorDetailsModal');
    modal.style.display = 'none';
  }

  closeModalOutside(event: any) {
    let modal = document.getElementById('doctorDetailsModal');
    if (event.target == modal) {
      this.closeModal();
    }
  }
  ngOnDestroy() {
    window.removeEventListener('click', this.closeModalOutside.bind(this));
  }

}


/*
  import { Component } from '@angular/core';
import { DoctorsService } from '../doctors.service';
import { GlobalServiceService } from '../../global-service.service';
 
@Component({
  selector: 'app-updatedoctordetails',
  templateUrl: './updatedoctordetails.component.html',
  styleUrl: './updatedoctordetails.component.css'
})
export class UpdatedoctordetailsComponent {
  constructor(public srv:DoctorsService,public idFromServer:GlobalServiceService){}
 
  Did=this.idFromServer.pId;
 
  ngOnInit(){
    this.getDoctorlist(this.Did);
 
  }
 
  getDoctorlist(id)
  {
    this.srv.getDoctorById(id)
  }
 
} */