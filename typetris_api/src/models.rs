use serde::{Deserialize, Serialize};

use crate::schema::scores;

#[derive(Debug, Clone, Serialize, Queryable, Insertable)]
pub struct Score {
    pub id: i32,
    pub player_name: String,
    pub score: i32,
    pub request_ip: String,
    pub created_at: chrono::NaiveDateTime,
}

impl Score {
    pub fn to_dto(&self) -> ScoreDto {
        ScoreDto {
            player_name: self.player_name.clone(),
            score: self.score.clone(),
        }
    }
}

#[derive(Debug, Clone, Deserialize, Serialize, Insertable)]
#[table_name = "scores"]
pub struct NewScore {
    pub player_name: String,
    pub score: i32,
    pub request_ip: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct ScoreDto {
    pub player_name: String,
    pub score: i32,
}
