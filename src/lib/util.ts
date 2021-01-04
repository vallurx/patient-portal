interface FormattedNameArgs {
    first_name: string | undefined;
    middle_initial: string | undefined;
    last_name: string | undefined;
    suffix: string | undefined;
}

export const formattedName = (userObj: FormattedNameArgs): string => {
    const first = userObj.first_name ? `${userObj.first_name} ` : '';
    const middle = userObj.middle_initial ? `${userObj.middle_initial} ` : '';
    const last = userObj.last_name ? `${userObj.last_name} ` : '';
    const suffix = userObj.suffix ? `${userObj.suffix} ` : '';

    return first + middle + last + suffix;
}