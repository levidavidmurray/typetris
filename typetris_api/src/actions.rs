use diesel::prelude::*;

use crate::models;
use ipnetwork::IpNetwork;
use std::net::SocketAddr;

/// Return the top scores limited by parameter
pub fn find_top_scores(
    conn: &PgConnection,
) -> Result<Vec<models::Score>, diesel::result::Error> {
    use crate::schema::scores::dsl::*;

    const TOP_SCORES_LIMIT: i32 = 10;

    Ok(scores
        .order((score.desc()))
        .limit(TOP_SCORES_LIMIT.into())
        .load::<models::Score>(conn)?)
}

/// Insert new player score
pub fn insert_new_score(
    p_name: &str,
    p_score: &i32,
    req_ip: &str,
    conn: &PgConnection,
) -> Result<models::Score, diesel::result::Error> {
    use crate::schema::scores::dsl::*;

    let new_score = models::NewScore {
        player_name: p_name.to_owned(),
        score: p_score.to_owned(),
        request_ip: req_ip.to_owned(),
    };

    let inserted_score = diesel::insert_into(scores)
        .values(&new_score)
        .get_result(conn)?;

    Ok(inserted_score)
}