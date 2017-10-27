/*   * By : Rumani Jain 
     * Version : Spec 1.0   
     * Date : 24 -October - 2017  
*/

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { HttpModule} from '@angular/http';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Observable';
import { RouterTestingModule }  from '@angular/router/testing';
import { RegisterComponent } from './register.component';
import { RegisterService } from '../shared/register.service';
import { By } from '@angular/platform-browser';
import { MailotpService} from '../shared/mailotp.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import 'rxjs/add/observable/of';


describe('RegisterComponent', () => {
  let component: RegisterComponent;
    let service: RegisterService;
    let serviceOTP: MailotpService;
  let fixture: ComponentFixture<RegisterComponent>;
  let de: DebugElement;
  let el:      HTMLElement;
  let titleElement:      HTMLElement;
  let spy:any;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule,
                  HttpModule,
                  RouterModule,
                  //Router,
                  BrowserAnimationsModule,
                  RouterTestingModule
                  ],
      declarations: [ RegisterComponent ],
      providers: [ RegisterService, MailotpService ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    
    
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
   
    service = TestBed.get(RegisterService);
    serviceOTP = TestBed.get(MailotpService);
    component.data.fullName="Rekha Sharma"
    component.data.email="rkha@gmail.com"
    component.data.password="pass"
    component.data.confirmPassword="pass"
    component.data.contact="9999999999" 
    component.data.gender="female"
    
  });
  it('Component definition', () => {
    expect(component).toBeDefined();
  });
  it('registerAction', () => {
    
      spy = spyOn(service, 'tempUser').and.returnValue(service.data = component.data);
      
      expect(spy).toBeDefined();
      expect(service.data).toBe(component.data)
      
  });
  it('should send email', () => {
     
     
     spyOn(service, 'tempUser').and.returnValue(service.data = component.data);
     spyOn(serviceOTP, 'sendMailOTP').and.returnValue(Observable.of("250 2.0.0 OK 1507360855 a25sm6437573pfc.143 - gsmtp"));   // <------- USE THIS "res" as flag as basis to call your second spy
     //fixture.detectChanges()
     component.register()
     fixture.detectChanges()
     console.log(component.errorMsg)
     expect(component.errorMsg).toBe("250 2.0.0 OK 1507360855 a25sm6437573pfc.143 - gsmtp")
   
 });

});
