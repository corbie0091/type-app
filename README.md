# My Restaurant Site

[Q] <Store info={data}>
data의 타입을 지정해줘야한다.=> 정의가 되지않은 객체 - 타입을 만들어야함
- 보통은 model이라는 폴더를 만들어서 타입을 다 넣음 ( interface와 type으로 가능)

해당 데이터에 맞게 타입을 정의
```
export type Restaurant = {
    name : string;
    category: string;
    address : Address;
    menu : Menu[]
}

export type Address = {
    city: string;
    detail : string;
    zipCode: number;
}

export type Menu = {
    name: string;
    price: number;
    category: string;
}
```
```
const [myRestaurant, setMyRestaurant] = useState<Restaurant>(data);
```
useState에 들어가는 데이터의 타입을 <>에 정의 
[Point]만약 setMyRestaurant(4)이런식의 호출을 하게 되면 오류가 남 ( 타입이 다르므로 )

info에서 아직 에러가 남 
-> store에서 받아주는 코드가 필요함 
받는 변수의 타입을 지정해줄 필요가 있음 

```
import React from "react"
import { Restaurant } from "./model/restaurant"

interface OwnProps {
    info: Restaurant
}

const Store:React.FC<OwnProps> = ({info}) => {
    return (
        <div>{info.name}</div>
    )
}

export default Store
``` 
이런 식으로 사용
- info에 대한 에러가 사라짐 

[Q]함수를 보낼 수 없나요 ?
```(App.js)
const changeAddress = (address:Address) => {
    setMyRestaurant({...myRestaurant, address:address})
  }
```
```(Store.js)
interface OwnProps {
    info: Restaurant
    changeAddress(address:Address):void;
}
```
함수의 매개변수와 리턴의 타입을 지정해줌 

[Q]Extends
type에 type을 추가하고 싶은 경우
extends를 써서 겹치는 타입을 사용하고 거기에 함수를 추가하게되는 경우가 생기면 extends에 추가해서 사용해주면 코드, 실수 모두가 줄게 된다.
```
interface OwnProps extends Menu {
    showBestMenuName(name: string): string;
}

const BestMenu:React.FC<OwnProps> = ({name, price, category, showBestMenuName}) => {
    return (
        <div>{name}</div>
    )
}
```

[참고] type도 extends가 가능함
```
type은  type OwnProps = Menu & {
    changebutton(props:string):string
}
```

[Q]3개의 타입이 설정되어 있는데 그중 한타입을 안쓰고 싶은 경우에는??
```
export type Address = {
    city: string;
    detail: string;
    zipCode: number;
}

export type AddressWithOutZip = Omit<Address, 'zipCode'>
```
- 이런식으로 Omit<[타입명], '빠주고싶은_안의_타입'>으로 정의해주면 된다

[Q]3개의 타입중 그중 한 타입만 쓰고싶은 경우에는??
```
export type AddressOnlyCity = Pick<Address, 'city'>
```

[Q] Omit필요 없이 ?연산자를 사용가능함 
- 와도 괜찮고 안와도 괜찮은 코드 -> 체크를 안하다보니 있어야하는 상황에도 넘어갈 수 있다. 

[Q] api로 데이터를 받아올 때 JSON형식으로 받음 
```
{
    data: [];
    totalPage: number;
    page: number;
}
```
- 추가적인 정보가 같이 들어오게 되는데... 
- 응답값을 타입스크립트로 처리할 때 부분부분만 쓰고싶다?? -> 타입으로 만들어주면 좋다.
=> 
export type ApiResponse<T> {
    data:T[];           // T타입의 배열
    totalPage: number;  // 전체 페이지 수
    page: number;       // 현재 페이지 번호
}

export type RestaurantResponse = ApiResponse<Restaurant>
export type MenuResponse = ApiResponse<Menu>

data가 어떤 데이터가 들어오는지 모를때 이렇게 해주면 타입이 바뀌게 됨 
-> 재사용성이 증가하게 됨

- [Point]
1. T 제네릭타입: 
- ApiResponse타입은 T라는 제네릭 타입을 받아들입니다.
- T는 호출하는 시점에 구체적으로 지정됩니다.

2. T의 활용:
- data속성은 T[]로 정의되어 있으므로, RestaurantResponse에서는 data가 Restaurant객체 배열, MenuResponse에서는 Menu객체 배열이 됩니다.
3. 재사용성:
- 다양한 데이터 타입에 대응 가능하므로 유연하게 여러 API응답을 처리할 수 있습니다.
- 예를 들어, ApiResponse<User> 나 ApiResponse<Product>등으로 확장 가능합니다.

``` // 동작 예시
type Restaurant = { id: number; name : string };
type Menu = { id: number; dish: string };

const restaurants: RestaurantResponse = {
    data: [
        {id:1, name: "A식당"},
        {id:2, name: "B식당"},
    ],
    totalPage: 5,
    page: 1.
};

const menus: MenuResponse = {
    data: [
        { id: 1, dish: "Pasta"},
        { id: 2, dish: "Pizza"},
    ],
    totalPage: 3,
    page: 2,
};

// 재사용성 및 타입 안정성
function fetchApiResponse<T>(response: ApiResponse<T>: T[] {
    console.log(`Page: ${responsse.page}, Total Pages: ${response.totalPage}, );
    return response.data;
})

const restaurantData = fetchApiResponse<Restaurant>(restaurants);
const menuData = fetchApiResponse<Menu>(menus);

// restaurantData와 menuData는 각각 Restaurant[], Menu[] 타입
```
[장점]
1. 타입안정성: 
- T를 통해 Api데이터 구조를 명확히 하므로, data가 어떤 타입인지 항상 알 수 있다.
- 잘못된 타입을 사용하려 하면 컴파일때 오류를 잡아준다.
2. 유지보수성: 
- 코드 중복을 줄이고 타입을 확장하거나 변경할 때도 수정이 간단하다.
3. 재사용성:
- 같은 API응 답형식을 가진 다른 엔드포인트에도 쉽게 재사용할 수 있다.