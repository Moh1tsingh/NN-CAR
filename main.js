const canvas = document.getElementById("myCanvas");
canvas.width=200;

const ctx = canvas.getContext("2d");
const road=new Road(canvas.width/2,canvas.width*0.9);
const car = new Car(road.getLaneCenter(1),100,30,50,"AI");

const N=1000;
const cars = generateCars(N); 
let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain")        
        );
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.125)
        }
    }
    
}

const traffic=[];

for(let i=100;i<2100;i+=100){
    let a,b,c
    a = Math.floor(Math.random() * 3);
    b = Math.floor(Math.random() * 3);
    c = Math.floor(Math.random() * 2);
    if(a!=b){
        if(c==0){
            traffic.push(new Car(road.getLaneCenter(a),-i,30,50,"DUMMY",2));
        }
        else{
            traffic.push(
                new Car(road.getLaneCenter(a),-i,30,50,"DUMMY",2),
                new Car(road.getLaneCenter(b),-i,30,50,"DUMMY",2)
                );
        }
    }
    

}


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
