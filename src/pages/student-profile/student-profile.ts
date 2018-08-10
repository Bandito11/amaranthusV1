import { EditPage } from '../edit/edit';
import { AmaranthusDBProvider } from '../../providers/amaranthus-db/amaranthus-db';
import { IStudent, IResponse } from '../../common/interface';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { handleError } from '../../common/handleError';


@IonicPage()
@Component({
  selector: 'page-student-profile',
  templateUrl: 'student-profile.html',
})
export class StudentProfilePage implements OnInit {

  constructor(
    public db: AmaranthusDBProvider,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    public navParams: NavParams
  ) { }

  /**
   * 
   * @param id 
   */
  goToEdit(id: string) {
    const modal = this.modalCtrl.create(EditPage, { id: id })
    modal.onWillDismiss(_ => this.getStudentFromDB(this.student));
    modal.present();
  }

  picture: string;
  gender: string;
  isActive: boolean;
  student: IStudent;
  headerName: string;

  ngOnInit() {
    this.student = <IStudent>{};
    this.picture = "";
    this.gender = 'male';
    this.isActive = false;
  }

  ionViewDidLoad() {
    this.student = { ...this.student, id: this.navParams.get('id') };
    try {
      const response = this.getStudentFromDB(this.student);
      if (response.success) {
        this.isActive = response.data.isActive;
        this.gender = response.data.gender;
        this.picture = response.data.picture;
        this.student = { ...response.data };
      }
    } catch (error) {
      handleError(error);
    }
  }

  getStudentFromDB(student: IStudent): IResponse<IStudent> {
    try {
      let response = this.db.getStudentById(student);
      return response;
    } catch (error) {
      handleError(error)
    };
  }


}