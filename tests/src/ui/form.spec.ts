/* tslint:disable:component-selector */

import {
    Component,
    ViewChild
} from '@angular/core';

import {
    TestBed,
    async,
    ComponentFixture
} from '@angular/core/testing';

import {
    DxFormModule,
    DxTagBoxModule,
    DxFormComponent
} from '../../../dist';

@Component({
    selector: 'test-container-component',
    template: ''
})
class TestContainerComponent {
    formData = {
        name: 'Unknown',
        date: new Date()
    };
    @ViewChild(DxFormComponent) formComponent: DxFormComponent;
}

describe('DxForm', () => {

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                declarations: [TestContainerComponent],
                imports: [DxFormModule, DxTagBoxModule]
            });
    });

    function getWidget(fixture: ComponentFixture<TestContainerComponent>) {
        return fixture.componentInstance.formComponent.instance;
    }

    // spec
    it('should be able to accept items via nested dxi components (T459714)', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-form id="form" [formData]="formData">
                        <dxi-item dataField="name" editorType="dxTextBox"></dxi-item>
                    </dx-form>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = getWidget(fixture);
        expect(instance.element().querySelectorAll('.dx-textbox').length).toBe(1);
    }));

    it('should be able to accept items recursively', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-form id="form" [formData]="formData">
                        <dxi-item caption="Root Group" itemType="group">
                            <dxi-item dataField="name" editorType="dxTextBox"></dxi-item>
                            <dxi-item caption="Inner Group" itemType="group">
                                <dxi-item dataField="name" editorType="dxTextBox"></dxi-item>
                            </dxi-item>
                        </dxi-item>
                    </dx-form>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = getWidget(fixture);
        expect(instance.element().querySelectorAll('.dx-textbox').length).toBe(2);
    }));

    it('should be able to accept items via nested dxi components with comment from ngIf directive (#440)', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-form id="form" [formData]="formData">
                        <dxi-item dataField="name" editorType="dxTextBox">
                            <dxi-validation-rule
                                *ngIf="true"
                                type="required"
                                message="item is required."
                            ></dxi-validation-rule>
                        </dxi-item>
                    </dx-form>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = getWidget(fixture);
        expect(instance.element().querySelectorAll('.dx-textbox').length).toBe(1);
    }));

    it('should update model after editor value was changed', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-form [formData]="formData">
                        <dxi-item dataField="name" editorType="dxTextBox">
                        </dxi-item>
                    </dx-form>
                    <span id="text">{{formData.name}}<span>
                `
            }
        });

        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.autoDetectChanges();

        let instance = getWidget(fixture);
        let input = instance.element().querySelector('input');
        input.value = 'test value';
        input.dispatchEvent(new Event('change'));

        expect(document.getElementById('text').innerText).toBe('test value');
        fixture.autoDetectChanges(false);
    });

    it('should work with dxTagBox', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-form
                        [formData]="{}"
                        [items]="[{
                            dataField: 'name',
                            editorType: 'dxTagBox',
                            editorOptions: {
                                dataSource: [{ value: 1, text: 'item 1' }, { value: 2, text: 'item 2' }, { value: 3, text: 'item 3' }],
                                displayExpr: 'text',
                                valueExpr: 'value'
                            }
                        }]"></dx-form>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let formInstance = getWidget(fixture);
        let tagBoxInstance = formInstance.getEditor('name');

        tagBoxInstance.option('value', [2]);
        fixture.detectChanges();

        expect(formInstance.option('formData.name')).toEqual([2]);
    }));

    it('should change the value of dxDateBox', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-form [formData]="formData">
                    </dx-form>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        fixture.componentInstance.formData.date = new Date(2017, 0, 1);
        fixture.detectChanges();

        let formInstance = getWidget(fixture);
        let dateBoxInstance = formInstance.getEditor('date');

        expect(dateBoxInstance.option('value')).toEqual(new Date(2017, 0, 1));
    }));
});
