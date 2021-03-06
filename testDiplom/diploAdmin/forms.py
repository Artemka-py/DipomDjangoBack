from django.contrib.auth import get_user_model
from django.db.models import Q

from django import forms

User = get_user_model()


class UserCreationForm(forms.ModelForm):
    password1 = forms.CharField(label='Пароль', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Подтверждение пароля', widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'middle_name', 'sur_name', 'birth_date', 'phone_num',
                'user_image_src']

    def clean_password(self):
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Пароли не совпадают")
        return password2

    def save(self, commit=True):
        user = super(UserCreationForm, self).save(commit=False)
        user.set_password(self.cleaned_data['password1'])

        if commit:
            user.save()
        return user


class UserLoginForm(forms.Form):
    query = forms.CharField(label='Логин или E-mail')
    password = forms.CharField(label='Пароль')

    def clean(self, *args, **kwargs):
        query = self.cleaned_data.get('query')
        password = self.cleaned_data.get('password')
        user_qs_final = User.objects.filter(
            Q(username__iexact=query) |
            Q(email__iexact=query)
        ).distinct()

        if not user_qs_final.exists() and user_qs_final.count != 1:
            raise forms.ValidationError("Не правильные данные - пользователя не существует")
        user_obj = user_qs_final.first()

        if not user_obj.check_password(password):
            raise forms.ValidationError("Не правильные данные")

        self.cleaned_data["user_obj"] = user_obj
        return super(UserLoginForm, self).clean(*args, **kwargs)

