import { Component } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { SelectItem } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { AutoComplete } from 'primeng/primeng';
import { CodeService } from './codeservice';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/components/common/api';
import { GrowlModule } from 'primeng/growl';




@Component({
	selector:'app-root',
	styleUrls: ['app.component.css'],
	templateUrl:'app.component.html'
})
export class AppComponent{
	diseaseCodes: string[];
	icd9Codes: string[];

	diseases: SelectItem[]=[];

	selectedDiseases: any[];

	codes: any[];

	code: any;

	msgs: Message[];

	scoreCalculated: boolean;

	filteredCodesMultiple: any[]; 

	files: any[] = [];

	score: number;

	diseaseMatchingPhecodes: string[];

	constructor(private httpClient:HttpClient, private codeservice:CodeService){

	}

	ngOnInit(){
		this.getDiseaseCodes();
		this.getIcd9Codes();

		}

		filterCodesMultiple(event) {
        	let query = event.query;
        	this.codeservice.getCodes().then(codes => {
            this.filteredCodesMultiple = this.filterCodes(query, codes);
            console.log(this.filteredCodesMultiple);
        });

        }

        filterCodes(query, codes: any[]):any[] {
        let filtered : any[] = [];
        for(let i = 0; i < codes.length; i++) {
            let code = codes[i];
            if(code.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(code);
            }
        }
        return filtered;
    }

	getDiseaseCodes(){
		this.httpClient.get('https://phe-rs.service.vumc.org/diseaseCodes').subscribe(data=>{
		var dCodes=data as JSON;
		this.diseaseCodes=dCodes['disease_codes'];
		for(var i=0;i<dCodes['disease_codes'].length;i++){
			this.diseases.push({label:dCodes['disease_codes'][i],value:{id:i,name:dCodes['disease_codes'][i]}});
		}
		})
	}

	getIcd9Codes(){
		this.httpClient.get('https://phe-rs.service.vumc.org/icd9Codes').subscribe(data=>{
		var icd9s=data as JSON;
		this.icd9Codes=icd9s['icd9_codes'];
		})
	}

	calculateScore(){
		try{
			var d=this.selectedDiseases[0].name;
			var codes=this.codes;
			var c=[];
			if(!codes){
				const params=new HttpParams().set('diseaseCode',String(d)).set('codes','');
				this.httpClient.get('https://phe-rs.service.vumc.org/score',{params}).subscribe(data=>{
					var score=data as JSON;
					this.score=score['score'];
					this.diseaseMatchingPhecodes=score['diseaseMatchingPhecodes'];
					console.log(this.score);
					console.log(this.diseaseMatchingPhecodes);
					this.scoreCalculated=true;
				})

			}else{
				for(var i=0;i<codes.length;i++){
					c.push(String(codes[i].name));
				}
				console.log(c);
				const params=new HttpParams().set('diseaseCode',String(d)).set('codes',String(c));
				this.httpClient.get('https://phe-rs.service.vumc.org/score',{params}).subscribe(data=>{
					var score=data as JSON;
					this.score=score['score'];
					this.diseaseMatchingPhecodes=score['diseaseMatchingPhecodes'];
					this.scoreCalculated=true;
				})
			}
			
		}catch(err){
			if(!this.selectedDiseases){
				this.msgs=[];
				this.msgs.push({severity:'error',summary:'Please select at least one disease',detail:''});
				console.log("please select atleast one disease");
			}

		}
		
	}

	clearCodes(){
		this.filteredCodesMultiple=null;
		this.codes=null;
		this.selectedDiseases=null;
		this.scoreCalculated=false;
		this.files=null;
	}

	onFileUpload(event){

		for(let file of event.files){
		    console.log(file);
		    let fileReader = new FileReader();
		    fileReader.readAsText(file);
		    fileReader.onload = (e) => {
      			var fileData=fileReader.result;
      			var rows=fileData.split("\n");
      			var header=rows[0];
      			if(header.includes("ICD9") || header.includes("icd9")){
      				this.files.push(file);
      				console.log("Good File");
      				this.msgs=[];
					this.msgs.push({severity:'info',summary:'File Uploaded',detail:''});
      			}else{
      				console.log("Bad File");
      				this.msgs=[];
					this.msgs.push({severity:'error',summary:'Invalid file. Please upload a file with icd9 codes with column name icd9 or ICD9',detail:''});
      			}
    		}
			

		}

		this.msgs=[];
		this.msgs.push({severity:'info',summary:'File Uploaded',detail:''});
	}

}
