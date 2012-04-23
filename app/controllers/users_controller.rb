class UsersController < ApplicationController
  # GET /users
  # GET /users.json
  def index
    @users = User.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @users }
    end
  end

  # GET /users/1
  # GET /users/1.json
  def show
    @user = User.find_by_username(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @user }
      format.js do
        if params[:callback]
          render text: "#{params[:callback]}(#{@user.to_json});"
        else
          render text: 'alert("callback is a required param");'
        end
      end
    end
  end

  # GET /users/new
  # GET /users/new.json
  def new
    @user = User.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @user }
    end
  end

  # GET /users/1/edit
  def edit
    @user = User.find_by_username(params[:id])
  end

  # POST /users
  # POST /users.json
  def create
    @user = User.new(params[:user])

    respond_to do |format|
      if @user.save
        format.html { redirect_to @user, notice: 'User was successfully created.' }
        format.json { render json: @user, status: :created, location: @user }
      else
        format.html { render action: "new" }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /users/1
  # PUT /users/1.json
  def update
    @user = User.find_by_username(params[:id])

    respond_to do |format|
      if @user.update_attributes(params[:user])
        format.html { redirect_to @user, notice: 'User was successfully updated.' }
        format.json { head :no_content }
        format.js do
          if params[:callback]
            render text: "#{params[:callback]}(#{@user.to_json});"
          else
            render head :no_content
          end
        end
      else
        format.html { render action: "edit" }
        format.json { render json: @user.errors, status: :unprocessable_entity }
        format.js do
          if params[:callback]
            render text: "#{params[:callback]}(#{@user.to_json}, #{@user.errors});"
          else
            render head :no_content, status: :unprocessable_entity
          end
        end
      end
    end
  end

  def upvote
    @user = User.find_by_username(params[:user_id])
    success = @user.update_attribute(:upvotes, @user.upvotes += 1);
    respond_to do |format|
      if success
        format.js do
          if params[:callback]
            render text: "#{params[:callback]}(#{@user.to_json});"
          else
            render head :no_content
          end
        end
      else
        format.js do
          if params[:callback]
            render text: "#{params[:callback]}(undefined);"
          else
            render head :no_content, status: :unprocessable_entity
          end
        end
      end
    end
  end

  # DELETE /users/1
  # DELETE /users/1.json
  def destroy
    @user = User.find_by_username(params[:id])
    @user.destroy

    respond_to do |format|
      format.html { redirect_to users_url }
      format.json { head :no_content }
    end
  end
end
