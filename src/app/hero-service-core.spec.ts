import { async, TestBed } from '@angular/core/testing';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { failure } from '../testing';

import { Hero } from './hero';
import { HeroService } from './hero.service';

/**
 * Common tests for the HeroService, whether implemented with Http or HttpClient
 * Assumes that TestBed has been configured appropriately before created and run.
 *
 * Tests with extended test expirations accommodate the default (simulated) latency delay.
 * Ideally configured for short or no delay.
 */
export class HereServiceCoreSpec {

  run() {

    describe('HeroService core', () => {

      let heroService: HeroService;

      beforeEach(function() {
        heroService = TestBed.get(HeroService);
      });

      it('can get heroes', async(() => {
        heroService.getHeroes()
          .subscribe(
          heroes => {
            // console.log(heroes);
            expect(heroes.length).toBeGreaterThan(0, 'should have heroes');
          },
          failure
          );
      }));

      it('can get hero w/ id=1', async(() => {
        heroService.getHero(1)
          .subscribe(
          hero => {
            // console.log(hero);
            expect(hero.name).toBe('Windstorm');
          },
          () => fail('getHero failed')
          );
      }));

      it('should 404 when hero id not found', async(() => {
        const id = 123456;
        heroService.getHero(id)
          .subscribe(
          () => fail(`should not have found hero for id='${id}'`),
          err => {
            expect(err.status).toBe(404, 'should have 404 status');
          }
          );
      }));

      it('can add a hero', async(() => {
        heroService.addHero('FunkyBob')
          .do(hero => {
            // console.log(hero);
            expect(hero.name).toBe('FunkyBob');
          })
          // Get the new hero by its generated id
          .switchMap(hero => heroService.getHero(hero.id))
          .subscribe(
          hero => {
            expect(hero.name).toBe('FunkyBob');
          },
          err => failure('re-fetch of new hero failed')
          );
      }), 10000);

      it('can delete a hero', async(() => {
        const id = 1;
        heroService.deleteHero(id)
          .subscribe(
          (_: {}) => {
            expect(_).toBeDefined();
          },
          failure
          );
      }));

      it('should allow delete of non-existent hero', async(() => {
        const id = 123456;
        heroService.deleteHero(id)
          .subscribe(
          (_: {}) => {
            expect(_).toBeDefined();
          },
          failure
          );
      }));

      it('can update existing hero', async(() => {
        const id = 1;
        heroService.getHero(id)
          .switchMap(hero => {
            hero.name = 'Thunderstorm';
            return heroService.updateHero(hero);
          })
          .switchMap(() => {
            return heroService.getHero(id);
          })
          .subscribe(
          hero => {
            console.log(hero);
            expect(hero.name).toBe('Thunderstorm');
          },
          err => fail('re-fetch of updated hero failed')
          );
      }), 10000);

      it('should create new hero when try to update non-existent hero', async(() => {
        const falseHero = new Hero(12321, 'DryMan');

        heroService.updateHero(falseHero)
          .subscribe(
          hero => {
            expect(hero.name).toBe(falseHero.name);
          },
          failure
          );
      }));

    });
 }
}