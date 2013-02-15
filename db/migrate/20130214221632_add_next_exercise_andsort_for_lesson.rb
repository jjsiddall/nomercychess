class AddNextExerciseAndsortForLesson < ActiveRecord::Migration
  def change
    add_column :exercises, :nextExercise, :string
    add_column :exercises, :sortForLesson, :integer
  end
end
