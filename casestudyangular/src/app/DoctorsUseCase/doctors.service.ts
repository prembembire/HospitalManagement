import { Injectable } from '@angular/core';
import { Doctors } from './modelclass.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Appointment } from './appointment.model';
import { Observable } from 'rxjs';
import { MedicalRecords } from './medical-records.model';
import { Idsmodel } from './idsmodel.model';

@Injectable({
  providedIn: 'root'
})
export class DoctorsService {
  readonly url="http://localhost:5012/api/doctors";
  getDocById:Doctors;
  docList:Doctors[]; 
  doctors:Doctors=new Doctors();
  apps:Appointment[];
  appointment: Appointment=new Appointment();

  medicalRecords:MedicalRecords=new MedicalRecords();
  getIds:Idsmodel;

  constructor(private objHttp:HttpClient) { }

  public getDoctorById(id: number): Observable<Doctors> {
    const token=localStorage.getItem('jwt')
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })
    };
    const apiUrl = `${this.url}/${id}`;
    return this.objHttp.get<Doctors>(apiUrl,httpOptions);
  }
  

  public getAllDoctors(): Promise<Doctors[]> {
    const token=localStorage.getItem('jwt')
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })
    };
    return this.objHttp.get(this.url,httpOptions).toPromise().then(
       (res: any) => {
          return res as Doctors[];
       }
    ).catch(
       error => {
          throw error; 
       }
    );
 }
 
 


  public registerDoctor(){
    const token=localStorage.getItem('jwt')
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })
    };
    return this.objHttp.post(this.url,this.doctors,httpOptions);
  }
  public updateDoctor(){
    const token=localStorage.getItem('jwt')
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })
    };
    return this.objHttp.put(this.url+"/"+this.doctors.DoctorId,this.doctors,httpOptions);
  }


 
  public deleteDoctor(id){
    const token=localStorage.getItem('jwt')
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })
    };
    return this.objHttp.delete(this.url+'/'+id,httpOptions);
  }

  
  public viewAppointments(id:number)
  {
    
    const token=localStorage.getItem('jwt')
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })
    };
     this.objHttp.get(this.url+'/View Appointments?id='+id,httpOptions).toPromise().then(res=>this.apps=res as Appointment[])
  }


  readonly AppUrl:'http://localhost:5012/api/Appointments/'

  public deleteAppointment(appointmentId:number)
  {
    const token=localStorage.getItem('jwt')
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })
    };
    const s = `${this.AppUrl}${appointmentId}`;
    return this.objHttp.delete(s,httpOptions);
  }

  public PostMedicalRecord()
 {
   const medUrl="http://localhost:5012/api/MedicalRecords";
   return this.objHttp.post(medUrl,this.medicalRecords);
 }

 readonly appurl="http://localhost:5012/api/Doctors/GetAppointmentDetails";

 public getAllIds(id:number){
  const Url = `${this.appurl}/${id}`;
  return this.objHttp.get<Idsmodel>(Url);
  
}

}
