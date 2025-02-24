import os
from flask import Flask
from flask_admin import Admin
from models import db, Users, Reservations, Reviews, Favorites, Restaurant, RestaurantPhotos, Dishes, DishesPhotos
from flask_admin.contrib.sqla import ModelView
from sqlalchemy.orm.properties import RelationshipProperty

class AdminView(ModelView):
    def __init__(self, model, session, **kwargs):
        self.column_list = [c.key for c in model.__table__.columns]
        for attr_name, attr in model.__mapper__.attrs.items():
            if isinstance(attr, RelationshipProperty):
                self.column_list.append(attr_name)
        self.form_excluded_columns = ["id"]
        self.form_columns = [col for col in self.column_list if col != "id"]
        super(AdminView, self).__init__(model, session, **kwargs)

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='The Spoon Admin', template_mode='bootstrap3')

    admin.add_view(AdminView(Users, db.session))
    admin.add_view(AdminView(Restaurant, db.session))
    admin.add_view(AdminView(RestaurantPhotos, db.session))
    admin.add_view(AdminView(Reservations, db.session))
    admin.add_view(AdminView(Reviews, db.session))
    admin.add_view(AdminView(Favorites, db.session))
    admin.add_view(AdminView(Dishes, db.session))
    admin.add_view(AdminView(DishesPhotos, db.session))