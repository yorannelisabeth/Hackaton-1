import { Component, OnInit } from '@angular/core';
import { RandomenmyService } from '../randomenmy.service';
import { RandomeggService } from '../randomegg.service';
import { Enemy } from '../enemy';
import { Player } from '../player';
import { Egg } from '../egg';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  enemyData:Enemy;
  eggData:Egg;

  constructor(private enemyService:RandomenmyService, private eggService:RandomeggService,) {

    this.enemyData;
    this.eggData;
    
   }

  ngOnInit() {

  }
  eggInventory = [];
  inFight: boolean = true;
  dead: boolean =false;
  player: Player = new Player;
  currentEnemy: Enemy = new Enemy;
  difficulty:number = 0;
  
  
  enemyMaxHealth = this.currentEnemy.health;
  playerMaxHealth = this.player.health;
  private delay(ms: number)
    {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  private async fight(){
    this.currentEnemy.health += (this.difficulty*5);
    this.currentEnemy.attack += this.difficulty;

    let eggPower:number = this.eggInventory.length;
    this.player.health += (eggPower*5);
    this.player.attack += eggPower;
    this.inFight = false;
    this.enemyService.getRandomEnemy().subscribe(
      (param_data:Enemy) => {
        this.enemyData = param_data;
      }
    )
    let enemyEgg: Egg = new Egg;
    this.eggService.getRandomEgg().subscribe(
      (param_data:Egg) => {
        this.eggData = param_data;
        enemyEgg = param_data;
      }
    )

    while(this.player.health > 0 && this.currentEnemy.health > 0){
      this.currentEnemy.health -= (this.player.attack - this.currentEnemy.defense);
      // 0.5 sec
      await this.delay(500);
      console.log(this.currentEnemy.health)
      if(this.currentEnemy.health <= 0){
        break
      }
      this.player.health -= (this.currentEnemy.attack - this.player.defense);
      // 0.5 sec
      await this.delay(500);
      console.log(this.player.health)
    }

    if(this.player.health <= 0 ) {
      this.dead = true;
    }
    else{
      console.log(enemyEgg)
      this.eggInventory.push(enemyEgg)
      alert("you won an egg and healed yourself")
      this.currentEnemy.health = this.enemyMaxHealth;
      this.player.health = this.playerMaxHealth;
      this.inFight = true;
      this.difficulty = this.difficulty + 1;
      console.log(this.difficulty)
    }
    
    console.log(this.eggInventory)
  }
}

