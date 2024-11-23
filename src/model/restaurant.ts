// let data = {
//     name: "와니바니 식당",
//     category: 'western',
//     address : {
//       city : 'Busan',
//       detail: 'seomyeon',
//       zipCode: 54723
//     },
//     menu: [ {name:"rose pasta",price: 2000, category: "PASTA"},
//       {name: 'garlic steak', price: 3000, category: "STEAK"},
//     ]
//   }


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