<?php

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create('App\Users');

        for ($i = 1; $i < 10; $i++) {

            DB::table('users')->insert([
                'name' => $faker->name(),
                'password' => '$2y$10$ZhvNM1nF1oEbQJJbbwvMw.a6K.uVgcLms7kyi76hHvCKv4f6SZChm',
                'email' => 'mizan' . $i . '@mail.com',
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now(),

            ]);
        }
    }
}
