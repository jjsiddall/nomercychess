class AddConclusionToExercises < ActiveRecord::Migration
  def change
    add_column :exercises, :conclusion, :text
  end
end
