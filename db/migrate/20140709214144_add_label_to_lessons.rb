class AddLabelToLessons < ActiveRecord::Migration
  def change
  	add_column :lessons, :label, :text
  end
end
