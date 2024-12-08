import {Page, test} from '@playwright/test'

export class HelperBase {
    readonly page:Page

    constructor(page:Page){
        this.page = page
    }

    async waitForNumberOfSeconds(timeOutSeconds:number){
        await this.page.waitForTimeout(timeOutSeconds)
    }
}