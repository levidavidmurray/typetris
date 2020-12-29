class CreateScores < ActiveRecord::Migration[6.0]
  def change
    create_table :scores, id: :uuid do |t|
      t.timestamps
      t.string :player, limit: 255
      t.integer :score
    end
  end
end
