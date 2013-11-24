class RenameColumnsFromCamelCase < ActiveRecord::Migration
  def change
    rename_column :exercises, :nextExercise, :next_exercise
    rename_column :exercises, :sortForLesson, :sort_for_lesson
  end
end
