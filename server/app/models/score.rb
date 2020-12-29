class Score < ApplicationRecord

  scope :top_10, -> { order(score: :desc).limit(10) }

end
