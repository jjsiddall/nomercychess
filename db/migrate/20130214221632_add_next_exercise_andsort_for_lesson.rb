class Addnext_exerciseAndsort_for_lesson < ActiveRecord::Migration
  def change
    add_column :exercises, :nextExercise, :string
    add_column :exercises, :sortForLesson, :integer
  end
end
