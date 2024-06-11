import { Injectable } from '@angular/core';
import { Patient } from './Patient.model';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Appointments } from './appointments.model';
import { PatientMedicalRecords } from './patient-medical-records.model';
import { User } from './user.model';
import { Observable, catchError, throwError } from 'rxjs';
import { BookAppointment } from './book-appointment.model';

@Injectable({
  providedIn: 'root'
})
export class PatientserviceService {
  
  readonly appUrl = "http://localhost:5012/api/Appointments/BookAppointment"
  readonly url="http://localhost:5012/api/patients";
  readonly authUrl="http://localhost:5012/api/Auth";


  list:Patient[];
  apps:Appointments[];
  appointment: Appointments=new Appointments();
  patient:Patient=new Patient();//Creating an instance of patient
  medRecords:PatientMedicalRecords[];
  getPatient:Patient;
  public userAuth:User=new User();
  bookApp:BookAppointment=new BookAppointment()
  constructor(private objHttp:HttpClient) { }

  public getById(id:number): Observable<Patient> {
    const token=localStorage.getItem('jwt')
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })
    };
    
    return this.objHttp.get<Patient>(this.url + "/" + id,httpOptions);
  }


  public getAllPatients(): Promise<Patient[]> {
    const token=localStorage.getItem('jwt')
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })
    };
    return this.objHttp.get(this.url,httpOptions).toPromise().then(
      (res: any) => {
        return res as Patient[];
      }
    ).catch(
      error => {
        throw error;
      }
    );
  }


  public getAllAppointments(id: number)
  {
    const token=localStorage.getItem('jwt')
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })
    };
    const appointmentsUrl = `${this.url}/ViewAppointments?id=${id}`;
    this.objHttp.get(appointmentsUrl,httpOptions).toPromise().then(res => this.apps = res as Appointments[]);
  }


  public getMedicalRecords(id:number)
  {
    const token=localStorage.getItem('jwt')
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })
    };
    const appointmentsUrl=`${this.url}/View MedicalHistory?id=${id}`;
    this.objHttp.get(appointmentsUrl,httpOptions).toPromise().then(res => this.medRecords = res as PatientMedicalRecords[]);
  }
  
  
  public registerPatient()
  {
    const token=localStorage.getItem('jwt')
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })
    };
    return this.objHttp.post(this.url,this.patient,httpOptions);//Here we need to pass the url and the id
  }


  public updatePatient(){//pass url+'/'+id and patient object
    const token=localStorage.getItem('jwt')
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })
    };
    return this.objHttp.put(this.url+"/"+this.patient.PatientId,this.patient,httpOptions);//To update the patient we need to pass the url(adding the id at the end) and the patient id
  }

  //In below we are passing the id to delete patient record.(Note: if the record is not present then
  // we will get an exception we need to show that exception so we need to create user defined excpetions in backend)
  public deletePatient(id){
    const token=localStorage.getItem('jwt')
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })
    };
    return this.objHttp.delete(this.url+'/'+id,httpOptions);//return the status of delete operation we'll get an msg fro backend check the code once
  }


  //Authentication
  public authentication(username: string, password: string) {
    this.userAuth.UserName=username;
    this.userAuth.Password=password;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.objHttp.post(this.authUrl, this.userAuth, httpOptions);
  }

  public BookAppointment()
  {
    const token=localStorage.getItem('jwt')
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })
    };
    console.log(this.bookApp.AppointmentDate);
      return this.objHttp.post(this.appUrl,this.bookApp,httpOptions)
  }











  // public getAvailableTimeSlots(doctId:number,appDate:Date):Observable<any>{
  //   const token=localStorage.getItem('jwt')
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${token}` 
  //     })
  //   };
  //   const url = `http://localhost:5012/api/Appointments/AvailableTimeSlots?doctorId=${doctId}&appointmentDate=${appDate.toISOString()}`;
  //   return this.objHttp.get<any>(url,httpOptions)
  // }

  public getAvailableTimeSlots(doctId: number, appDate: Date): Observable<any> {
    
  
    const token = localStorage.getItem('jwt');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  
    const url = `http://localhost:5012/api/Appointments/AvailableTimeSlots?doctorId=${doctId}&appointmentDate=${appDate.toISOString().split('T')[0]}`;
    return this.objHttp.get<any>(url, httpOptions).pipe(
      catchError(error => {
        console.error("Error fetching available time slots:", error);
        return throwError(error);
      })
    );
  }
  




}














































































