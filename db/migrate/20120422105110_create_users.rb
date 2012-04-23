class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :username
      t.string :fullname
      t.integer :upvotes

      t.timestamps
    end
  end
end
