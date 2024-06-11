
import { Component, OnInit } from '@angular/core';
import { DoctorsService } from '../../DoctorsUseCase/doctors.service';
import { NgForm } from '@angular/forms';
import { Doctors } from '../../DoctorsUseCase/modelclass.model';

@Component({
  selector: 'app-manage-doctors',
  templateUrl: './manage-doctors.component.html',
  styleUrls: ['./manage-doctors.component.css']
})
export class ManageDoctorsComponent implements OnInit {
  onlyShowGetDoctors: boolean = true;
  doctorId: number = null;
  doctorLst: Doctors[] = [];

  constructor(public srv: DoctorsService) {}

  ngOnInit() {
    this.getAllDoctors();
    window.addEventListener('click', this.closeModalOutside.bind(this));
  }

  getAllDoctors() {
       this.srv.getAllDoctors().then(
          (doctors: Doctors[]) => {
             this.doctorLst = doctors;
          }
       ).catch(
          error => {
             console.error("Error fetching doctors:", error);
          }
       );
    }
    
    getDoctorById() {
     if (this.doctorId) {
       this.srv.getDoctorById(this.doctorId).subscribe(
         (doctor: Doctors) => {
           if (doctor) {
             this.doctorLst = [doctor];
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
     } else if (this.doctorLst != null) {
       this.getAllDoctors();
     } else {
       alert("No records found with ID " + this.doctorId);
     }
   }
      fillForm(doctor: Doctors) {
         this.onlyShowGetDoctors = false;
         this.srv.doctors = doctor;
      }

      delDoctor(doctorId: number) {
         if(confirm("Are you sure to delete this Doctor details?")) {
            this.srv.deleteDoctor(doctorId).subscribe(
               () => {
                  alert("Doctor deletion successful");
                  this.getAllDoctors();
               },
               err => {
                  alert("Error Occurred: " + err);
               }
            );
         }
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
               this.getAllDoctors();
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
