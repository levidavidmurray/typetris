#[macro_use]
extern crate diesel;

use actix_cors::Cors;
use actix_web::{get, middleware, post, web, App, Error, HttpResponse, HttpServer, HttpRequest, http::header};
use diesel::prelude::*;
use diesel::r2d2::{self, ConnectionManager};
use ipnetwork;

mod handlers;
mod actions;
mod models;
mod schema;

use handlers::{score_handler};

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    std::env::set_var(
        "RUST_LOG",
        "typetris_api=debug,actix_web=info,actix_server=info"
    );
    env_logger::init();
    dotenv::dotenv().ok();

    // set up database connection pool
    let database_url = std::env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");

    let manager = ConnectionManager::<PgConnection>::new(database_url);
    let pool = r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to create pool.");

    let bind = "127.0.0.1:3000";

    println!("Starting server at: {}", &bind);

    HttpServer::new(move || {
        App::new()
            .data(pool.clone())
            .wrap(
                Cors::new()
                        .allowed_origin("http://localhost:8080")
                        .allowed_methods(vec!["GET", "POST"])
                        .allowed_header(header::CONTENT_TYPE)
                        .max_age(3600)
                        .finish(),
            )
            .wrap(middleware::Logger::default())
            .data(web::JsonConfig::default().limit(4096))
            .service(
                web::scope("/api")
                    .service(
                        web::resource("/scores")
                            .route(web::get().to(score_handler::get_leaderboard))
                            .route(web::post().to(score_handler::add_score)),
                    ),
            )
    })
        .bind(&bind)?
        .run()
        .await
}
