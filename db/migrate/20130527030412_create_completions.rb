class CreateCompletions < ActiveRecord::Migration
  def change
    create_table :completions do |t|
      t.integer :user_id
      t.integer :exercise_id
      t.string :last_completed

      t.timestamps
    end
  end
end
