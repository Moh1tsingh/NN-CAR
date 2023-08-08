const canvas = document.getElementById("myCanvas");
canvas.width=200;

const ctx = canvas.getContext("2d");
const road=new Road(canvas.width/2,canvas.width*0.9);
const car = new Car(road.getLaneCenter(1),100,30,50,"AI");

const N=1;
const cars = generateCars(N); 
let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain")        
        );
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.15)
        }
    }
    
}

const traffic=[
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-550,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-800,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-620,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-450,30,50,"DUMMY",2),

    new Car(road.getLaneCenter(1),-1000,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-1200,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-1200,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-1450,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-1700,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-1520,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-1350,30,50,"DUMMY",2),

    new Car(road.getLaneCenter(0),-1800,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-1880,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-2440,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-2220,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-1735,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-1920,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-2100,30,50,"DUMMY",2),
];


animate();

function save(){
    localStorage.setItem("bestBrain",
    JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function generateCars(N){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
    }
    return cars;

}

function animate(){
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders,traffic);

    }
    bestCar = cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        )
    );
    

    canvas.height=window.innerHeight;

    ctx.save();
    ctx.translate(0,-bestCar.y+canvas.height*0.7);

    road.draw(ctx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(ctx,"red");
    }

    ctx.globalAlpha=0.2;

    for(let i=0;i<cars.length;i++){
        cars[i].draw(ctx,"blue");
    }
    ctx.globalAlpha=1;
    bestCar.draw(ctx,"blue",true);

    ctx.restore();
    requestAnimationFrame(animate);
}