import { MONTHSLABELS } from '../../common/constants';
import { EditPage } from '../edit/edit';
import { AmaranthusDBProvider } from '../../providers/amaranthus-db/amaranthus-db';
import { IStudent } from '../../common/interface';
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

  picture: string;
  gender: string;
  isActive: boolean;
  student: IStudent & LokiObj;
  headerName: string;
  notes: {note: string, date: string}[];
  
  /**
   * 
   * @param id 
   */
  goToEdit(id: string) {
    const modal = this.modalCtrl.create(EditPage, { id: id })
    modal.onWillDismiss(_ => this.getStudentFromDB(this.student));
    modal.present();
  }

  ngOnInit() {
    this.student = <IStudent & LokiObj>{};
    this.picture = "";
    this.gender = 'male';
    this.isActive = false;
    this.notes = [];
  }

  ionViewDidLoad() {
    this.student = { ...this.student, id: this.navParams.get('id') };
    this.getStudentFromDB(this.student);
    this.getNotesFromDB(this.student.id);
  }

  getNotesFromDB(id: string) {
    try {
      const response = this.db.getAllNotesById(id);
      if (response.success) {
        let note: { note, date };
        let date;
        for (const data of response.data) {
         date = `${MONTHSLABELS[data.month]}, ${data.day} ${data.year}`;
         note = {
           note: data.notes, 
           date: date
          };
         this.notes = [...this.notes, note]
        }
      }
    } catch (error) {
      handleError(error);
    }
  }

  getStudentFromDB(student: IStudent) {
    try {
      let response = this.db.getStudentById(student);
      if (response.success) {
        this.isActive = response.data.isActive;
        this.gender = response.data.gender;
        this.picture = response.data.picture;
        this.student = { ...response.data };
      }
    } catch (error) {
      handleError(error)
    };
  }


}