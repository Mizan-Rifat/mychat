<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::middleware('auth:airlock')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/test', 'HomeController@test');
Route::get('/checkauth', 'HomeController@check');

Route::group(['middleware' => 'auth:airlock'], function () {

    Route::get('/messages', 'MessageController@getMessages');
    Route::get('/allusers', 'MessageController@getAllusers');
    Route::post('/sendmessage', 'MessageController@store');
    Route::post('/deletemessage', 'MessageController@delete');
    Route::post('/deleteallmessages', 'MessageController@deleteAll');
    Route::post('/setseen', 'MessageController@setSeen');
    Route::get('/getunreadmessages','MessageController@getMessagesCount');
    Route::post('/uploadfiles','MessageController@uploadFiles');

});

Broadcast::routes(['middleware' => ['auth:airlock']]);
