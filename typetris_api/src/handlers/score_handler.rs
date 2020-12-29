use actix_web::{get, middleware, post, web, App, Error, HttpResponse, HttpServer, HttpRequest};
use diesel::prelude::*;
use diesel::r2d2::{self, ConnectionManager};
use ipnetwork;

use crate::actions;
use crate::models;
use std::str::FromStr;

type Pool = r2d2::Pool<ConnectionManager<PgConnection>>;

/// Returns leaderboard scores
pub async fn get_leaderboard(
    pool: web::Data<Pool>,
) -> Result<HttpResponse, Error> {
    let conn = pool.get().expect("Couldn't get db connection");

    let top_scores = web::block(move || actions::find_top_scores(&conn))
        .await
        .map_err(|e| {
            eprintln!("{}", e);
            HttpResponse::InternalServerError().finish()
        })?;

    let res: Vec<models::ScoreDto> = top_scores.into_iter()
        .map(|score| score.to_dto()).collect();

    Ok(HttpResponse::Ok().json(res))
}

/// Inserts new score
pub async fn add_score(
    pool: web::Data<Pool>,
    new_score: web::Json<models::ScoreDto>,
    req: HttpRequest,
) -> Result<HttpResponse, Error> {
    let conn = pool.get().expect("Couldn't get db connection");

    let req_ip = match req.peer_addr() {
        Some(addr) => addr.ip().to_string(),
        None => String::from("None"),
    };

    let score = web::block(move || actions::insert_new_score(
        &new_score.player_name,
        &new_score.score,
        &req_ip,
        &conn,
    ))
        .await
        .map_err(|e| {
            eprintln!("{}", e);
            HttpResponse::InternalServerError().finish()
        })?;

    get_leaderboard(pool).await
}
