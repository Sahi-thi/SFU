import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-provider-services',
    templateUrl: './provider-services.component.html',
    styleUrls: ['./provider-services.component.scss']
})
export class ProviderServicesComponent implements OnInit {

    constructor() { }

    ngOnInit() {
    }

    searchFieldObserver() {
        //     const providerFormArray: any = this.providerFormGroup.get('services')['controls'] as FormArray;

        //     providerFormArray.forEach((element, index) => {
        //         element.controls['service_name'].valueChanges.subscribe(
        //             (result) => {
        //                 const searchInput = result;
        //                 const servicesKey = 'item_' + index;

        //                 try {
        //                     if (searchInput.trim().length === 0) {
        //                         this.selectedOnlyService.delete(servicesKey);
        //                     }

        //                     const serviceObject = this.serviceTypeMapData.get(servicesKey);
        //                     const tempData = Object.assign([], this.serviceMapData.get(serviceObject.type));

        //                     const tempSelectedOnlyService: any = this.selectedOnlyService;
        //                     if (tempSelectedOnlyService) {
        //                         for (let [key, value] of tempSelectedOnlyService) {
        //                             tempData.map((item, index) => {
        //                                 if (key !== servicesKey) {
        //                                     if (item.service === value) {
        //                                         tempData.splice(index, 1);
        //                                     }

        //                                 }
        //                             });
        //                         }
        //                     }
        //                     if (searchInput != null && searchInput.trim().length > 0) {
        //                         const result = tempData.filter((item) => {
        //                             {
        //                                 if (item.service.toLowerCase().includes(searchInput.toLowerCase())) {
        //                                     return item;
        //                                 }
        //                             }
        //                         });
        //                         this.serviceTypeMapData.get(servicesKey).services = result;

        //                     } else {
        //                         this.serviceTypeMapData.get(servicesKey).services = tempData;

        //                     }
        //                 } catch (err) {
        //                     console.log(err);
        //                 }

        //             }
        //         );
        //     });

    }

}
