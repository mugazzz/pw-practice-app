import {Page, test} from '@playwright/test'
import { Navigation } from './NavigationPage'
import { FormLayoutPage } from './FormLayoutPage'

export class PageManager{
    readonly page:Page
    readonly navigateTo: Navigation
    readonly formLayoutPageCases: FormLayoutPage

    constructor(page:Page){
        this.page = page
        this.navigateTo = new Navigation(this.page)
        this.formLayoutPageCases = new FormLayoutPage(this.page)
    }

    async navigation(navigateTo: Navigation){
        return this.navigateTo
    }

    async FormLayoutPage(formLayoutPageCases: FormLayoutPage){
        return this.formLayoutPageCases
    }
}