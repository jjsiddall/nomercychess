class MovesController < ApplicationController
  # GET /moves
  # GET /moves.json
  def index
    @moves = Move.all
    @move = Move.new
    
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @moves }
      # format.csv { render text: Move.to_csv(@moves), filename: "test.csv" }
      format.csv { 
        send_data(
          Move.to_csv(@moves),
          :type => 'application/excel',
          :filename => 'moves.csv',
          :disposition => 'attachment'
        ) 
      }

    end
  end

  # def csv
  #   @moves = Move.where(:move_number => "1")
  #   send_data(
  #     Move.to_csv(@moves),
  #     :type => 'text/csv',
  #     :filename => 'export.csv',
  #     :disposition => 'attachment'
  #   )
  # end


  # GET /moves/1
  # GET /moves/1.json
  def show
    @move = Move.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @move }
    end
  end

  # GET /moves/new
  # GET /moves/new.json
  def new
    @move = Move.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @move }
    end
  end

  # GET /moves/1/edit
  def edit
    @move = Move.find(params[:id])

    respond_to do |format|
      format.js
      format.html
    end
  end

  # POST /moves
  # POST /moves.json
  def create
    @move = Move.new(params[:move])

    respond_to do |format|
      if @move.save
        format.js
        format.html { redirect_to @move, notice: 'Move was successfully created.' }
        format.json { render json: @move, status: :created, location: @move }
      else
        format.html { render action: "new" }
        format.json { render json: @move.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /moves/1
  # PUT /moves/1.json
  def update
    @move = Move.find(params[:id])

    respond_to do |format|
      if @move.update_attributes(params[:move])
        format.js
        format.html { redirect_to @move, notice: 'Move was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @move.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /moves/1
  # DELETE /moves/1.json
  def destroy
    @move = Move.find(params[:id])
    @move.destroy

    respond_to do |format|
      format.js
      format.html { redirect_to moves_url }
      format.json { head :no_content }
    end
  end

  def import
    Move.import(params[:file])
    redirect_to builder_lessons_path, notice: "Moves imported."
  end
end
