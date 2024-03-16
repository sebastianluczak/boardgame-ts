interface MyInterface {
    property: string;
    secondProperty: boolean;
    thirdProperty: number;
    array?: number[];
}

let myObject = {} as MyInterface;

class MyClass {
    private innerClassProperty: MyInterface;
    
    public constructor() {
        this.innerClassProperty = {
            property: 'test1',
            secondProperty: false,
            thirdProperty: 420
        };
    }
    
    public addElement(element: string) {
        if (!this.innerClassProperty.array) {
            this.innerClassProperty.array = [];
        }
        this.innerClassProperty.array.push(element);
    }
    
    public getValues(): void {
        console.table(this.innerClassProperty);
    }    
}

let myInstance = new MyClass();
myInstance.addElement(420);
myInstance.addElement(880.000099);
//myInstance.innerClassProperty.property = 'MODIFIED';
myInstance.getValues();
