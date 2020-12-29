class AddIpToScores < ActiveRecord::Migration[6.0]
  def change
    add_column :scores, :client_ip, :string
  end
end
